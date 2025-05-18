// src/components/forms/UserTable.tsx

import React from 'react';
import { User } from '../../../types'; // User data model
import Button from '../../ui/Button'; // Reusable Button component

/////////////////////////////
// Props Definition
/////////////////////////////

/**
 * UserTableProps
 *
 * @property users           - Array of users with `created_at` timestamp
 * @property editUserId      - ID of the user currently in edit mode (or null)
 * @property editForm        - Partial user data being edited
 * @property onStartEdit     - Callback to begin editing a specific user
 * @property onCancelEdit    - Callback to cancel the current edit
 * @property onSaveEdit      - Callback to save changes for a user
 * @property onEditFormChange- Callback when any edit field changes
 * @property formatDate      - Utility to format ISO dates into human-readable form
 */
interface UserTableProps {
  users: (User & { created_at: string })[];
  editUserId: string | null;
  editForm: Partial<User>;
  onStartEdit: (u: User & { created_at: string }) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userId: string, body: Partial<User>) => void;
  onEditFormChange: (field: keyof User, value: string) => void;
  formatDate: (isoString: string) => string;
}

/////////////////////////////
// Component Definition
/////////////////////////////

/**
 * UserTable
 *
 * Renders a responsive table of users with inline edit functionality.
 * - Displays ID, Name, Email, Phone, and Joined At columns.
 * - Allows editing a single row at a time with Save/Cancel actions.
 * - Hides less-critical columns on smaller screens for responsiveness.
 */
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
  // Wrapper enables horizontal scrolling on narrow viewports
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm rounded-md">
      {/* Table header */}
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-left">ID</th>
          <th className="px-3 py-2 text-left">Name</th>
          {/* Hidden on small screens */}
          <th className="hidden sm:table-cell px-3 py-2 text-left">Email</th>
          {/* Hidden on medium screens and below */}
          <th className="hidden md:table-cell px-3 py-2 text-left">Phone</th>
          {/* Hidden on small screens */}
          <th className="hidden sm:table-cell px-3 py-2 text-left">
            Joined At
          </th>
          <th className="px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>

      {/* Table body */}
      <tbody>
        {users.map(u => (
          <tr key={u.id} className="border-t">
            {/* ID cell */}
            <td className="px-3 py-2">{u.id}</td>

            {/* Name cell: switches to input if editing this row */}
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

            {/* Email cell, hidden on very small screens */}
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

            {/* Phone cell, hidden on medium screens and below */}
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

            {/* Joined At cell: formatted date, hidden on small screens */}
            <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap">
              {formatDate(u.created_at)}
            </td>

            {/* Actions cell */}
            <td className="px-3 py-2">
              <div className="flex space-x-2">
                {editUserId === u.id ? (
                  <>
                    {/* Save & Cancel actions for the editing row */}
                    <Button onClick={() => onSaveEdit(u.id, editForm)}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={onCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  // Edit action for non-editing rows
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
