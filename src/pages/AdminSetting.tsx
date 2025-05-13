import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';

// Admin can configure system-wide limits and view statistics
export type AdminSettings = {
  maxActiveEvents: number;
  maxInvitations: number;
  maxEventCapacity: number;
};

export type AdminStats = {
  totalUsers: number;
  totalEvents: number;
  numPublicEvents: number;
  numPrivateEvents: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

function AdminSetting() {
  // Settings state
  const [settings, setSettings] = useState<AdminSettings>({
    maxActiveEvents: 5,
    maxInvitations: 20,
    maxEventCapacity: 100,
  });
  const [dirty, setDirty] = useState(false);

  // Statistics state
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEvents: 0,
    numPublicEvents: 0,
    numPrivateEvents: 0,
  });

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // simulate fetching existing settings, stats, and users
  useEffect(() => {
    // TODO: replace with real API calls
    setSettings({
      maxActiveEvents: 5,
      maxInvitations: 20,
      maxEventCapacity: 100,
    });
    setStats({
      totalUsers: 1280,
      totalEvents: 320,
      numPublicEvents: 200,
      numPrivateEvents: 120,
    });
    setUsers([
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-123-4567',
        role: 'organizer',
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '555-987-6543',
        role: 'attendee',
      },
      {
        id: 3,
        name: 'Carol Lee',
        email: 'carol@example.com',
        phone: '555-555-0000',
        role: 'admin',
      },
      // ...more mock users
    ]);
  }, []);

  const handleSettingChange = (field: keyof AdminSettings, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSaveSettings = () => {
    // TODO: POST or PUT to API
    console.log('Saved admin settings:', settings);
    setDirty(false);
  };

  const handleResetSettings = () => {
    setSettings({
      maxActiveEvents: 5,
      maxInvitations: 20,
      maxEventCapacity: 100,
    });
    setDirty(false);
  };

  const startEditUser = (user: User) => {
    setEditUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };

  const cancelEditUser = () => {
    setEditUserId(null);
    setEditForm({});
  };

  const saveEditUser = (id: number) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? {
              ...u,
              name: editForm.name || '',
              email: editForm.email || '',
              phone: editForm.phone || '',
            }
          : u,
      ),
    );
    setEditUserId(null);
    setEditForm({});
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-8 mt-4">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
          <p className="mt-2 text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
          <p className="mt-2 text-2xl font-bold">{stats.totalEvents}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600">Public Events</h3>
          <p className="mt-2 text-2xl font-bold">{stats.numPublicEvents}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600">Private Events</h3>
          <p className="mt-2 text-2xl font-bold">{stats.numPrivateEvents}</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Max Active Events per User
            </label>
            <input
              type="number"
              min={1}
              value={settings.maxActiveEvents}
              onChange={e =>
                handleSettingChange('maxActiveEvents', Number(e.target.value))
              }
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Max Invitations per User
            </label>
            <input
              type="number"
              min={1}
              value={settings.maxInvitations}
              onChange={e =>
                handleSettingChange('maxInvitations', Number(e.target.value))
              }
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Default Event Capacity
            </label>
            <input
              type="number"
              min={1}
              value={settings.maxEventCapacity}
              onChange={e =>
                handleSettingChange('maxEventCapacity', Number(e.target.value))
              }
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveSettings} disabled={!dirty}>
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            Reset
          </Button>
        </div>
      </div>

      {/* Users Section */}
      <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <table className="w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-3 py-2">{user.id}</td>
                <td className="px-3 py-2">
                  {editUserId === user.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e =>
                        setEditForm(prev => ({ ...prev, name: e.target.value }))
                      }
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-3 py-2">
                  {editUserId === user.id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e =>
                        setEditForm(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-3 py-2">
                  {editUserId === user.id ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e =>
                        setEditForm(prev => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  ) : (
                    user.phone
                  )}
                </td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2 space-x-2">
                  {editUserId === user.id ? (
                    <>
                      <Button onClick={() => saveEditUser(user.id)}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEditUser}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => startEditUser(user)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 border border-primary rounded ${
                currentPage === idx + 1
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
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

export default AdminSetting;
