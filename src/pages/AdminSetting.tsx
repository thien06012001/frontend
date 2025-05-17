/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/AdminSetting.tsx

import { useState, useEffect, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Event, User } from '../types';
import { handleAPI } from '../handlers/api-handler';

// Reusable UI components
import StatsGrid from '../components/pages/admin/StatsGrid';
import EventsSummary from '../components/pages/admin/EventsSummary';
import SettingsForm, {
  AdminSettings,
} from '../components/pages/admin/SettingsForm';
import UserTable from '../components/pages/admin/UserTable';
import PaginationInput from '../components/pages/admin/PaginationInput';

/**
 * Format an ISO date string into DD/MM/YYYY
 */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}

export default function AdminSetting() {
  // — Settings state: current values & whether they've been modified
  const [settings, setSettings] = useState<AdminSettings>({
    maxActiveEvents: 5,
    maxEventCapacity: 100,
  });
  const [dirty, setDirty] = useState(false);

  // — Search term for filtering users & the user list itself
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<(User & { created_at: string })[]>([]);

  // — Which user is being edited, and the temporary form values
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // — Fetch raw data from server
  const { data: userData } = useFetch('/admin/users/all', { method: 'GET' });
  const { data: eventData } = useFetch('/admin/events/all', { method: 'GET' });
  const { data: settingsData } = useFetch('/settings', { method: 'GET' });

  // Memoize lists to avoid unnecessary recalculations
  const allUsers = useMemo(
    () => (userData?.data as (User & { created_at: string })[]) || [],
    [userData],
  );
  const allEvents = (eventData?.data as Event[]) || [];

  // — Categorize events by date
  const now = new Date();
  const pastEvents = allEvents.filter(e => new Date(e.end_time) < now);
  const currentEvents = allEvents.filter(
    e => new Date(e.start_time) <= now && new Date(e.end_time) >= now,
  );
  const upcomingEvents = allEvents.filter(e => new Date(e.start_time) > now);

  // — Pagination state for the user table
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Populate users & initial settings once fetches complete
  useEffect(() => {
    if (allUsers.length) {
      setUsers(allUsers);
    }
    if (settingsData) {
      setSettings({
        maxActiveEvents: settingsData.setting.maxActiveEvents,
        maxEventCapacity: settingsData.setting.maxEventCapacity,
      });
    }
  }, [allUsers, settingsData]);

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter & slice users for current page
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // — Handlers

  /**
   * Move to a different page in the user table.
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /**
   * Update a field in the settings form and mark dirty.
   */
  const handleSettingChange = (field: keyof AdminSettings, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  /**
   * Begin editing a user: populate edit form with their values.
   */
  const startEditUser = (u: User & { created_at: string }) => {
    setEditUserId(u.id);
    setEditForm({ name: u.name, email: u.email, phone: u.phone });
  };

  /** Cancel in-progress user edit. */
  const cancelEditUser = () => {
    setEditUserId(null);
    setEditForm({});
  };

  /**
   * Submit edited user data to the server and update local state.
   */
  const editUser = async (userId: string, body: Partial<User>) => {
    const res = await handleAPI(`/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to update user');
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, name: body.name!, email: body.email!, phone: body.phone! }
          : u,
      ),
    );
    cancelEditUser();
  };

  /**
   * Save modified settings to the server.
   */
  const updateSettings = async () => {
    const res = await handleAPI('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    setDirty(false);
  };

  /**
   * Reset settings to defaults both locally and on the server.
   */
  const handleReset = async () => {
    const newSetting = { maxActiveEvents: 5, maxEventCapacity: 50 };
    const res = await handleAPI('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSetting),
    });
    if (!res.ok) throw new Error('Failed to reset settings');
    setSettings(newSetting);
    setDirty(false);
  };

  // — Prepare data arrays for the StatsGrid & EventsSummary components
  const statsItems = [
    { label: 'Total Users', value: allUsers.length },
    { label: 'Total Events', value: allEvents.length },
    {
      label: 'Public Events',
      value: allEvents.filter(e => e.is_public).length,
    },
    {
      label: 'Private Events',
      value: allEvents.filter(e => !e.is_public).length,
    },
  ];
  const eventSummaries = [
    { title: 'Past Events', count: pastEvents.length },
    { title: 'Current Events', count: currentEvents.length },
    { title: 'Upcoming Events', count: upcomingEvents.length },
  ];

  return (
    <div className="space-y-8 mt-4 p-4">
      {/* Top-level statistics */}
      <StatsGrid items={statsItems} />

      {/* Past / current / upcoming event counts */}
      <EventsSummary summaries={eventSummaries} />

      {/* Settings form panel */}
      <SettingsForm
        settings={settings}
        dirty={dirty}
        onChange={handleSettingChange}
        onSave={updateSettings}
        onReset={handleReset}
      />

      {/* User Management Section */}
      <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          {/* Search box */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-primary rounded-md p-2 w-full sm:w-64 outline-none"
          />
        </div>

        {/* Editable user table */}
        <UserTable
          users={paginatedUsers}
          editUserId={editUserId}
          editForm={editForm}
          onStartEdit={startEditUser}
          onCancelEdit={cancelEditUser}
          onSaveEdit={editUser}
          onEditFormChange={(field, value) =>
            setEditForm(prev => ({ ...prev, [field]: value }))
          }
          formatDate={formatDate}
        />

        {/* Pagination controls */}
        <PaginationInput
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
