/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AdminSetting.tsx

import { useState, useEffect, useMemo } from 'react';
import Button from '../components/ui/Button';
import { useFetch } from '../hooks/useFetch';
import { Event, User } from '../types';
import { handleAPI } from '../handlers/api-handler';

/** Format ISO date string to DD/MM/YYYY */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AdminSetting() {
  // Settings state
  const [settings, setSettings] = useState({
    maxActiveEvents: 5,
    maxEventCapacity: 100,
  });
  const [dirty, setDirty] = useState(false);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const { data: userData } = useFetch('/admin/users/all', { method: 'GET' });
  const { data: eventData } = useFetch('/admin/events/all', { method: 'GET' });
  const { data: settingsData } = useFetch('/settings', { method: 'GET' });
  console.log(settingsData);

  const allUsers: (User & { created_at: string })[] = useMemo(
    () => userData?.data || [],
    [userData],
  );

  const allEvents: Event[] = eventData?.data || [];
  const publicEvents = allEvents.filter(e => e.is_public);
  const privateEvents = allEvents.filter(e => !e.is_public);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const pageSize = 10;

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

  // Keep inputPage synced to currentPage
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const clamp = (p: number) => Math.min(Math.max(1, p), totalPages);

  const handlePageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(clamp(inputPage));
    }
  };
  const handlePageBlur = () => {
    setCurrentPage(clamp(inputPage));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSettingChange = (field: keyof typeof settings, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const startEditUser = (u: User) => {
    setEditUserId(u.id);
    setEditForm({ name: u.name, email: u.email, phone: u.phone });
  };
  const cancelEditUser = () => {
    setEditUserId(null);
    setEditForm({});
  };
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

  const updateSettings = async () => {
    const res = await handleAPI('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    setDirty(false);
  };

  const handleReset = async () => {
    const newSetting = {
      maxActiveEvents: 5,
      maxEventCapacity: 50,
    };
    const res = await handleAPI('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maxActiveEvents: 5,
        maxEventCapacity: 50,
      }),
    });

    if (!res.ok) throw new Error('Failed to reset settings');

    setSettings(newSetting);
    setDirty(false);
  };

  return (
    <div className="space-y-8 mt-4 p-4">
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: allUsers.length },
          { label: 'Total Events', value: allEvents.length },
          { label: 'Public Events', value: publicEvents.length },
          { label: 'Private Events', value: privateEvents.length },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 bg-gray-100 rounded-lg text-center">
            <h3 className="text-sm font-medium text-gray-600">{label}</h3>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700">
              Max Active Events per User
            </label>
            <input
              type="number"
              min={1}
              value={settings.maxActiveEvents}
              onChange={e =>
                handleSettingChange('maxActiveEvents', Number(e.target.value))
              }
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Max Event Capacity
            </label>
            <input
              type="number"
              min={1}
              value={settings.maxEventCapacity}
              onChange={e =>
                handleSettingChange('maxEventCapacity', Number(e.target.value))
              }
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={updateSettings} disabled={!dirty}>
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* User Management */}
      <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="hidden sm:table-cell px-3 py-2 text-left">
                  Email
                </th>
                <th className="hidden md:table-cell px-3 py-2 text-left">
                  Phone
                </th>
                <th className="hidden lg:table-cell px-3 py-2 text-left">
                  Role
                </th>
                <th className="hidden sm:table-cell px-3 py-2 text-left">
                  Joined At
                </th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-3 py-2">{u.id}</td>
                  <td className="px-3 py-2">
                    {editUserId === u.id ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="hidden sm:table-cell px-3 py-2">
                    {editUserId === u.id ? (
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="hidden md:table-cell px-3 py-2">
                    {editUserId === u.id ? (
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                    ) : (
                      u.phone
                    )}
                  </td>
                  <td className="hidden lg:table-cell px-3 py-2">{u.role}</td>
                  <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap">
                    {formatDate((u as any).created_at)}
                  </td>
                  <td className="">
                    <div className="flex px-3 py-2 space-x-2">
                      {editUserId === u.id ? (
                        <>
                          <Button onClick={() => editUser(u.id, editForm)}>
                            Save
                          </Button>
                          <Button variant="outline" onClick={cancelEditUser}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => startEditUser(u)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
          >
            Prev
          </button>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={inputPage}
              onChange={e => setInputPage(Number(e.target.value))}
              onKeyDown={handlePageKeyDown}
              onBlur={handlePageBlur}
              className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
            />
            <span className="text-sm text-gray-600">/ {totalPages}</span>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
