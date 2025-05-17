import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import Button from '../../ui/Button';
import { Event } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<FormData | null>(null);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setForm(event);
  }, [event]);

  const handleChange = <K extends keyof Event>(field: K, value: Event[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const readFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        handleChange('image_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileInput working!');
    const files = e.target.files;

    if (files) {
      const formData = new FormData();
      formData.append('my-image-file', files[0], files[0].name);
      setImageFile(formData);
      setImage(files[0]);
      console.log('Image file set:', files[0]);
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

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Prepare updated data
      const updateData = { ...form };
      let url = form.image_url;

      if (imageFile) {
        const uploadRes = await fetch('http://localhost:5000/image-upload', {
          method: 'POST',
          body: imageFile,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadRes.json();
        url = uploadData.url;
      }

      // Send update request
      const response = await handleAPI(`/events/${event.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updateData,
          image_url: url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update event');
      }

      // If update successful, update form state with new data
      setForm(prev => ({
        ...prev,
        image_url: url,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to update event',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(event);
    setIsEditing(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex flex-col-reverse md:flex-wrap-reverse md:flex-row md:items-center md:justify-between">
        {isEditing ? (
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="text-3xl font-bold  pb-1 focus:outline-none"
          />
        ) : (
          <h1 className="text-3xl font-bold" itemProp="name">
            {form.name}
          </h1>
        )}
        {isOrganizer && (
          <div className="flex space-x-2 ms-auto">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
      <div className="flex-col flex space-y-4 md:space-y-0 md:flex-row md:space-x-8">
        {/* Image Section (below title) */}
        <div>
          {isEditing ? (
            <>
              <div
                className={`size-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
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
                onChange={handleFileChange}
              />
              {image && (
                <div className="mt-4 size-64 overflow-hidden rounded-lg">
                  <img
                    src={URL.createObjectURL(image)}
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
              className=" size-64 object-cover rounded-lg"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col ">
          {/* Description */}
          <div className="">
            {isEditing ? (
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none"
              />
            ) : (
              <p
                className="text-gray-700 leading-relaxed"
                itemProp="description"
              >
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
                  value={new Date(form.start_time).toISOString().split('T')[0]}
                  onChange={e => {
                    const newDate = e.target.value;
                    const oldTime = new Date(form.start_time)
                      .toISOString()
                      .split('T')[1];
                    handleChange('start_time', `${newDate}T${oldTime}`);
                  }}
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
              <label className="font-medium text-gray-600">End Time</label>
              {isEditing ? (
                <input
                  type="time"
                  value={new Date(form.end_time).toTimeString().substring(0, 5)}
                  onChange={e => {
                    const newTime = e.target.value;
                    const currentDate = new Date(form.end_time)
                      .toISOString()
                      .split('T')[0];
                    handleChange('end_time', `${currentDate}T${newTime}:00`);
                  }}
                  className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                />
              ) : (
                <span className="mt-1">
                  {new Date(form.end_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

            {/* Type */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Type</label>
              {isEditing ? (
                <select
                  value={form.is_public ? 'Public' : 'Private'}
                  onChange={e =>
                    handleChange('is_public', e.target.value === 'Public')
                  }
                  className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              ) : (
                <span className="mt-1">
                  {form.is_public ? 'Public' : 'Private'}
                </span>
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
                  min="1"
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
      </div>
    </div>
  );
}

export default Info;
