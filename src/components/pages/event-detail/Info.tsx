import { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../../ui/Button';
import { Event } from '../../../types';

export type EventInfo = {
  name: string;
  description: string;
  date: string; // ISO date
  timeRange: string; // e.g. "18:00 - 22:00"
  type: string; // "Public" | "Private"
  slot: { participated: number; capacity: number };
  location: string;
  imageUrl: string; // URL of event image or data URL
};

type Props = {
  event: Event;
  isOrganizer: boolean;
};

function Info({ event, isOrganizer }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Event>(event);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setForm(event);
  }, [event]);

  const handleChange = <K extends keyof EventInfo>(
    field: K,
    value: EventInfo[K],
  ) => setForm(prev => ({ ...prev, [field]: value }));

  const readFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        handleChange('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    console.log('Saved event info:', form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(event);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="text-3xl font-bold border-b border-gray-300 pb-1 flex-1 focus:outline-none"
          />
        ) : (
          <h1 className="text-3xl font-bold" itemProp="name">
            {form.name}
          </h1>
        )}
        {isOrganizer && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        )}
      </div>

      {/* Image Section (below title) */}
      <div>
        {isEditing ? (
          <>
            <div
              className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                dragOver ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <p className="text-gray-500 mb-2">
                {dragOver
                  ? 'Release to upload image'
                  : 'Drag & drop image here'}
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Or click to upload
              </Button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
            {/* Preview before saving */}
            {form.image_url && (
              <div className="mt-4 w-full h-64 overflow-hidden rounded-lg">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </>
        ) : (
          <img
            src={form.image_url}
            alt={form.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Description */}
      <div>
        {isEditing ? (
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed" itemProp="description">
            {form.description}
          </p>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600">Date</label>
          {isEditing ? (
            <input
              type="date"
              value={form.start_time}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          ) : (
            <time dateTime={form.start_time} className="mt-1">
              {new Date(form.start_time).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>

        {/* Time */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600">Time</label>
          {isEditing ? (
            <input
              type="text"
              value={form.end_time}
              onChange={e => handleChange('timeRange', e.target.value)}
              placeholder="18:00 - 22:00"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          ) : (
            <span className="mt-1">{form.end_time}</span>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600">Type</label>
          {isEditing ? (
            <select
              value={form.is_public}
              onChange={e => handleChange('type', e.target.value)}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          ) : (
            <span className="mt-1">{form.is_public}</span>
          )}
        </div>

        {/* Capacity */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600">Capacity</label>
          {isEditing ? (
            <input
              type="number"
              value={form.capacity}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  capacity: Number(e.target.value),
                }))
              }
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:outline-none"
            />
          ) : (
            <span className="mt-1">
              {form.participants.length} / {form.capacity}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-medium text-gray-600">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          ) : (
            <address className="mt-1 not-italic">{form.location}</address>
          )}
        </div>
      </div>
    </div>
  );
}

export default Info;
