import React from 'react';
import { User } from '../../../types';
import Button from '../../ui/Button';

// Props definition for UserTable
interface UserTableProps {
  // List of users, each with a created_at timestamp
  users: (User & { created_at: string })[];
  // Currently editing user ID, or null if none
  editUserId: string | null;
  // Partial form data for the user being edited
  editForm: Partial<User>;
  // Callback to start editing a given user
  onStartEdit: (u: User & { created_at: string }) => void;
  // Callback to cancel the current edit
  onCancelEdit: () => void;
  // Callback to save the edited user data
  onSaveEdit: (userId: string, body: Partial<User>) => void;
  // Callback when any field in the edit form changes
  onEditFormChange: (field: keyof User, value: string) => void;
  // Utility to format an ISO timestamp into a human-readable string
  formatDate: (isoString: string) => string;
}

// Functional component declaration
const UserTable: React.FC<UserTableProps> = ({
  users,
  editUserId,
  editForm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  formatDate,
}) => (
  // Container with horizontal overflow handling
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm rounded-md">
      {/* Table header */}
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-left">ID</th>
          <th className="px-3 py-2 text-left">Name</th>
          {/* Hide on small screens */}
          <th className="hidden sm:table-cell px-3 py-2 text-left">Email</th>
          {/* Hide on medium screens and below */}
          <th className="hidden md:table-cell px-3 py-2 text-left">Phone</th>
          {/* Hide on small screens */}
          <th className="hidden sm:table-cell px-3 py-2 text-left">
            Joined At
          </th>
          <th className="px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody>
        {users.map(u => (
          // Each row keyed by user ID
          <tr key={u.id} className="border-t">
            {/* ID column */}
            <td className="px-3 py-2">{u.id}</td>

            {/* Name column: show input if editing, otherwise plain text */}
            <td className="px-3 py-2">
              {editUserId === u.id ? (
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={e => onEditFormChange('name', e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-full"
                />
              ) : (
                u.name
              )}
            </td>

            {/* Email column, hidden on small screens */}
            <td className="hidden sm:table-cell px-3 py-2">
              {editUserId === u.id ? (
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={e => onEditFormChange('email', e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-full"
                />
              ) : (
                u.email
              )}
            </td>

            {/* Phone column, hidden on medium screens and below */}
            <td className="hidden md:table-cell px-3 py-2">
              {editUserId === u.id ? (
                <input
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={e => onEditFormChange('phone', e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-full"
                />
              ) : (
                u.phone
              )}
            </td>

            {/* Joined At column: always formatted and hidden on small screens */}
            <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap">
              {formatDate(u.created_at)}
            </td>

            {/* Actions column */}
            <td className="px-3 py-2">
              <div className="flex space-x-2">
                {editUserId === u.id ? (
                  <>
                    {/* Save and Cancel buttons when editing */}
                    <Button onClick={() => onSaveEdit(u.id, editForm)}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={onCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  // Edit button when not editing
                  <Button variant="outline" onClick={() => onStartEdit(u)}>
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
);

export default UserTable;
