import React from 'react';
import Button from '../../ui/Button';

/////////////////////////////////
// Settings Data Type         //
/////////////////////////////////

/**
 * Shape of the settings object managed by this form.
 * - maxActiveEvents: maximum number of active events a user can have
 * - maxEventCapacity: maximum capacity allowed per event
 */
export interface AdminSettings {
  maxActiveEvents: number;
  maxEventCapacity: number;
}

/////////////////////////////////
// Component Props Definition //
/////////////////////////////////

/**
 * Props for the SettingsForm component:
 * - settings: current settings values
 * - dirty: whether settings have been modified since last save
 * - onChange: callback to update a single field
 * - onSave: callback to persist settings to the server
 * - onReset: callback to reset settings to defaults
 */
interface SettingsFormProps {
  settings: AdminSettings;
  dirty: boolean;
  onChange: (field: keyof AdminSettings, value: number) => void;
  onSave: () => void;
  onReset: () => void;
}

/////////////////////////////////
// Component Implementation   //
/////////////////////////////////

/**
 * Renders a form allowing admins to view and modify:
 *  - Max Active Events per User
 *  - Max Event Capacity
 *
 * Includes Save and Reset buttons.
 */
const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  dirty,
  onChange,
  onSave,
  onReset,
}) => (
  // Outer container with padding, white background, and rounded shadow
  <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
    {/* Form title */}
    <h1 className="text-2xl font-bold">Admin Settings</h1>

    {/* Two-column layout on md+, single column on smaller screens */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Max Active Events field */}
      <div>
        <label className="block font-medium text-gray-700">
          Max Active Events per User
        </label>
        <input
          type="number"
          min={1}
          value={settings.maxActiveEvents}
          // Notify parent of changes
          onChange={e => onChange('maxActiveEvents', Number(e.target.value))}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none"
        />
      </div>

      {/* Max Event Capacity field */}
      <div>
        <label className="block font-medium text-gray-700">
          Max Event Capacity
        </label>
        <input
          type="number"
          min={1}
          value={settings.maxEventCapacity}
          // Notify parent of changes
          onChange={e => onChange('maxEventCapacity', Number(e.target.value))}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none"
        />
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex space-x-2">
      {/* Save: disabled until there are unsaved changes */}
      <Button onClick={onSave} disabled={!dirty}>
        Save Settings
      </Button>
      {/* Reset to defaults */}
      <Button variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  </div>
);

export default SettingsForm;
