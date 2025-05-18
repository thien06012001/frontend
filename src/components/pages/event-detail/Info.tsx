// src/components/pages/event-detail/Info.tsx

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router'; // Hook to programmatically navigate
import useUser from '../../../hooks/redux/useUser'; // Hook to access current user info
import Button from '../../ui/Button'; // Reusable Button component
import { Event, Request } from '../../../types'; // Type definitions
import { handleAPI } from '../../../handlers/api-handler'; // API helper for HTTP requests

/**
 * Props for the Info component.
 *
 * @param event        - The Event object containing all event details.
 * @param isOrganizer  - Boolean flag indicating if the current user is the event owner.
 */
type Props = {
  event: Event;
  isOrganizer: boolean;
};

/**
 * Info Component
 *
 * Displays detailed information about an event.
 * - Shows event title, description, dates, capacity, and location.
 * - Supports in-place editing for organizers, including image upload via drag & drop.
 * - Allows participants to request/join, cancel, or leave the event.
 */
export default function Info({ event, isOrganizer }: Props) {
  const navigate = useNavigate(); // For redirecting after deletion
  const user = useUser(); // Decrypted user object
  const userId = user.id; // Current user's ID

  // Local UI state
  const [isEditing, setIsEditing] = useState(false); // Toggles edit mode
  const [form, setForm] = useState<Event>(event); // Editable copy of event data
  const [dragOver, setDragOver] = useState(false); // Drag-over state for image upload
  const [imageFile, setImageFile] = useState<FormData | null>(null); // File payload for upload
  const [image, setImage] = useState<File | null>(null); // Local preview file
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks ongoing API calls
  const [errorMessage, setErrorMessage] = useState(''); // Displays any error message

  // Sync form state if the prop `event` changes
  useEffect(() => {
    setForm(event);
  }, [event]);

  /**
   * handleChange
   *
   * Generic updater for form fields.
   *
   * @param field - Key of the Event field to update.
   * @param value - New value for that field.
   */
  const handleChange = <K extends keyof Event>(field: K, value: Event[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  /**
   * readFile
   *
   * Reads an image file as a Data URL and updates `image_url` in form state.
   *
   * @param file - File object dropped or selected by the user
   */
  const readFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('image_url', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * handleFileChange
   *
   * Triggered when user selects a file via the file input.
   * Prepares a FormData payload for upload and updates preview.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const fd = new FormData();
    fd.append('my-image-file', file, file.name);
    setImageFile(fd);
    setImage(file);
    readFile(file);
  };

  /**
   * Drag-and-drop handlers for the upload area.
   */
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

  // Derive participant/request relationships
  const requests = Array.isArray(form.requests)
    ? (form.requests as Request[])
    : [];
  const participants = Array.isArray(form.participants)
    ? form.participants
    : [];

  const isPending = requests.some(
    r => r.user_id === userId && r.status === 'pending',
  );
  const isJoined = participants.some(p => p.id === userId);
  const isOwner = isOrganizer; // Alias for clarity

  // Determine the action button label
  const actionLabel = isPending ? 'Cancel' : isJoined ? 'Leave' : 'Request';

  /**
   * handleRequestAction
   *
   * Unified handler for request/cancel/leave actions.
   * Performs optimistic UI update on success.
   */
  const handleRequestAction = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (!isPending && !isJoined) {
        // Send join request
        const res = await handleAPI('/requests', {
          method: 'POST',
          body: JSON.stringify({ eventId: form.id, userId }),
        });
        if (!res.ok) throw new Error('Failed to send request');
        setForm(prev => ({
          ...prev,
          requests: [
            ...(prev.requests || []),
            { user_id: userId, status: 'pending' } as Request,
          ],
        }));
      } else if (isPending) {
        // Cancel pending request
        const res = await handleAPI(
          `/requests?userId=${userId}&eventId=${form.id}`,
          { method: 'DELETE' },
        );
        if (!res.ok) throw new Error('Failed to cancel request');
        setForm(prev => ({
          ...prev,
          requests: (prev.requests || []).filter(
            r => !(r.user_id === userId && r.status === 'pending'),
          ),
        }));
      } else {
        // Leave event
        const res = await handleAPI(`/events/${form.id}/leave`, {
          method: 'POST',
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error('Failed to leave event');
        setForm(prev => ({
          ...prev,
          participants: (prev.participants || []).filter(p => p.id !== userId),
        }));
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * handleSave (Organizer only)
   *
   * Uploads a new image if present, then updates the event via API.
   * Exits edit mode on success.
   */
  const handleSave = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const uploadRes = await fetch('http://localhost:5000/image-upload', {
          method: 'POST',
          body: imageFile,
        });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      const res = await handleAPI(`/events/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form, image_url: imageUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update event');
      }
      setForm(prev => ({ ...prev, image_url: imageUrl }));
      setIsEditing(false);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * handleCancelEdit
   *
   * Reverts form state to original event and exits edit mode.
   */
  const handleCancelEdit = () => {
    setForm(event);
    setIsEditing(false);
    setErrorMessage('');
  };

  /**
   * handleDelete (Organizer only)
   *
   * Deletes the event after confirmation and navigates away.
   */
  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await handleAPI(`/events/${form.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Delete failed');
      }
      navigate('/my-events');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header: Title or editable input + action buttons */}
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between">
        {isEditing ? (
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="text-3xl font-bold pb-1 focus:outline-none"
          />
        ) : (
          <h1 className="text-3xl font-bold">{form.name}</h1>
        )}

        <div className="flex space-x-2 ms-auto">
          {isOwner ? (
            isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )
          ) : (
            <Button onClick={handleRequestAction} disabled={isSubmitting}>
              {isSubmitting ? 'Processing…' : actionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Main content: image + details grid */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-8">
        {/* Image or upload area */}
        <div>
          {isEditing ? (
            <>
              <div
                className={`w-64 h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                  dragOver ? 'border-primary bg-primary/10' : 'border-gray-300'
                }`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <p className="text-gray-500 mb-2">
                  {dragOver ? 'Release to upload' : 'Drag & drop image'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Upload
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {image && (
                <div className="mt-4 w-64 h-64 overflow-hidden rounded-lg">
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
              className="w-64 h-64 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Details grid for description, dates, capacity, etc. */}
        <div className="flex-1 space-y-4">
          {isEditing ? (
            <textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{form.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date Field */}
            <div>
              <label className="font-medium text-gray-600">Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={new Date(form.start_time).toISOString().slice(0, 10)}
                  onChange={e => {
                    const date = e.target.value;
                    const time = form.start_time.split('T')[1];
                    handleChange('start_time', `${date}T${time}`);
                  }}
                  className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                />
              ) : (
                <time dateTime={form.start_time} className="mt-1 block">
                  {new Date(form.start_time).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>

            {/* End Time Field */}
            <div>
              <label className="font-medium text-gray-600">End Time</label>
              {isEditing ? (
                <input
                  type="time"
                  value={new Date(form.end_time).toTimeString().slice(0, 5)}
                  onChange={e => {
                    const t = e.target.value;
                    const datePart = form.end_time.split('T')[0];
                    handleChange('end_time', `${datePart}T${t}:00`);
                  }}
                  className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                />
              ) : (
                <span className="mt-1 block">
                  {new Date(form.end_time).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

            {/* Public/Private Selector */}
            <div>
              <label className="font-medium text-gray-600">Type</label>
              {isEditing ? (
                <select
                  value={form.is_public ? 'Public' : 'Private'}
                  onChange={e =>
                    handleChange('is_public', e.target.value === 'Public')
                  }
                  className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                >
                  <option>Public</option>
                  <option>Private</option>
                </select>
              ) : (
                <span className="mt-1 block">
                  {form.is_public ? 'Public' : 'Private'}
                </span>
              )}
            </div>

            {/* Capacity Field */}
            <div>
              <label className="font-medium text-gray-600">Capacity</label>
              {isEditing ? (
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={e =>
                    handleChange('capacity', Number(e.target.value))
                  }
                  className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none"
                />
              ) : (
                <span className="mt-1 block">
                  {participants.length} / {form.capacity}
                </span>
              )}
            </div>

            {/* Location Field */}
            <div className="md:col-span-2">
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
