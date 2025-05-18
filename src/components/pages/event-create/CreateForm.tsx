// src/components/pages/event-create/CreateForm.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import Button from '../../ui/Button';
import { handleAPI } from '../../../handlers/api-handler';
import useUser from '../../../hooks/redux/useUser';

/////////////////////////////
// Time Validation Regex
/////////////////////////////
/** Matches 24-hour time in "HH:MM" format (00–23 for hours, 00–59 for minutes) */
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default function CreateForm() {
  /////////////////////////////
  // Compute minimum date for date picker (today)
  /////////////////////////////
  const [minDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  /////////////////////////////
  // Form field state
  /////////////////////////////
  const [eventType, setEventType] = useState<'Public' | 'Private'>('Public');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number | undefined>();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<FormData | null>(null);
  const [image, setImage] = useState<File | null>(null);

  /////////////////////////////
  // Validation error state
  /////////////////////////////
  const [startTimeError, setStartTimeError] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');

  /////////////////////////////
  // Backend error state
  /////////////////////////////
  const [backendError, setBackendError] = useState('');

  /////////////////////////////
  // Current user from Redux (for owner_id)
  /////////////////////////////
  const user = useUser();

  /////////////////////////////
  // Field validators
  /////////////////////////////
  const validateStartTime = (value: string) => {
    if (!value) {
      setStartTimeError('Start time is required');
    } else if (!timeRegex.test(value)) {
      setStartTimeError('Invalid time format (HH:MM)');
    } else {
      setStartTimeError('');
    }
  };

  const validateEndTime = (value: string) => {
    if (!value) {
      setEndTimeError('End time is required');
    } else if (!timeRegex.test(value)) {
      setEndTimeError('Invalid time format (HH:MM)');
    } else {
      setEndTimeError('');
    }
  };

  /////////////////////////////
  // Change handlers with validation
  /////////////////////////////
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    validateStartTime(value);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    validateEndTime(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(value.trim() ? '' : 'Event name is required');
  };

  const handleCapacityChange = (value: string) => {
    const num = Number(value);
    setCapacity(num);
    setCapacityError(
      !value || isNaN(num) || num < 1 ? 'Capacity must be at least 1' : '',
    );
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setLocationError(value.trim() ? '' : 'Location is required');
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setDateError(value ? '' : 'Date is required');
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setDescriptionError(value.trim() ? '' : 'Description is required');
  };

  /////////////////////////////
  // File input handler
  /////////////////////////////
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const form = new FormData();
      form.append('my-image-file', files[0], files[0].name);
      setImage(files[0]);
      setImageFile(form);
      setImageError('');
    }
  };

  /////////////////////////////
  // Form validity check
  /////////////////////////////
  const isFormValid = () => {
    return (
      !startTimeError &&
      !endTimeError &&
      !nameError &&
      !capacityError &&
      !locationError &&
      !dateError &&
      !descriptionError &&
      !imageError &&
      startTime &&
      endTime &&
      name &&
      capacity !== undefined &&
      capacity > 0 &&
      location &&
      date &&
      description &&
      image
    );
  };

  /////////////////////////////
  // Submit handler
  /////////////////////////////
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendError(''); // Clear previous backend error

    // Trigger all field validations
    validateStartTime(startTime);
    validateEndTime(endTime);
    setNameError(name.trim() ? '' : 'Event name is required');
    setCapacityError(
      !capacity || capacity < 1 ? 'Capacity must be at least 1' : '',
    );
    setLocationError(location.trim() ? '' : 'Location is required');
    setDateError(date ? '' : 'Date is required');
    setDescriptionError(description.trim() ? '' : 'Description is required');
    setImageError(image ? '' : 'Event image is required');

    if (!isFormValid()) return;

    try {
      // 1) Upload image to external service
      const uploadRes = await fetch('http://localhost:5000/image-upload', {
        method: 'POST',
        body: imageFile!,
      });
      if (!uploadRes.ok) {
        const errJson = await uploadRes.json();
        throw new Error(errJson.message || 'Image upload failed');
      }
      const { url } = await uploadRes.json();

      // 2) Create event via API
      const payload = {
        name,
        start_time: `${date}T${startTime}:00`,
        end_time: `${date}T${endTime}:00`,
        owner_id: user.id,
        is_public: eventType === 'Public',
        location,
        capacity: capacity || 0,
        description,
        image_url: url,
      };

      const res = await handleAPI('/events', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (!res.ok) {
        setBackendError(
          result.error || result.message || 'Failed to create event',
        );
        return;
      }

      // On success, redirect to the new event’s detail page
      window.location.href = `/event/${result.data.id}`;
    } catch (err: unknown) {
      setBackendError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    }
  };

  /////////////////////////////
  // Render form
  /////////////////////////////
  return (
    <form onSubmit={handleSubmit} className="flex flex-1 w-full space-x-4">
      {/* Left column: image upload & time inputs */}
      <div className="flex flex-col items-start space-y-2.5">
        <label className="w-40 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-400 text-2xl">🖼️</span>
          )}
        </label>
        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Start Time (HH:MM)</label>
          <input
            type="text"
            placeholder="e.g. 14:30"
            value={startTime}
            onChange={e => handleStartTimeChange(e.target.value)}
            className="border border-gray-200 rounded-md p-1"
          />
          {startTimeError && (
            <p className="text-red-500 text-sm">{startTimeError}</p>
          )}

          <label className="font-semibold mt-2">End Time (HH:MM)</label>
          <input
            type="text"
            placeholder="e.g. 18:00"
            value={endTime}
            onChange={e => handleEndTimeChange(e.target.value)}
            className="border border-gray-200 rounded-md p-1"
          />
          {endTimeError && (
            <p className="text-red-500 text-sm">{endTimeError}</p>
          )}
        </div>
      </div>

      {/* Right column: event details */}
      <div className="flex flex-1 flex-col space-y-4">
        {/* Event type selector */}
        <div className="flex items-center space-x-6">
          {(['Public', 'Private'] as const).map(type => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="radio"
                name="eventType"
                value={type}
                checked={eventType === type}
                onChange={() => setEventType(type)}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span className="font-semibold">{type} Event</span>
            </label>
          ))}
        </div>

        {/* Name & capacity */}
        <div className="flex w-full space-x-5">
          <div className="flex flex-col space-y-1 flex-1">
            <label className="font-semibold">Event Name</label>
            <input
              type="text"
              placeholder="Enter the name of your event"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              className="border border-gray-200 rounded-md p-1"
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Capacity</label>
            <input
              type="number"
              placeholder="Event capacity"
              value={capacity}
              onChange={e => handleCapacityChange(e.target.value)}
              className="border border-gray-200 rounded-md p-1"
            />
            {capacityError && (
              <p className="text-red-500 text-sm">{capacityError}</p>
            )}
          </div>
        </div>

        {/* Location & date */}
        <div className="flex w-full space-x-5">
          <div className="flex flex-col space-y-1 flex-1">
            <label className="font-semibold">Location</label>
            <input
              type="text"
              placeholder="Enter the location"
              value={location}
              onChange={e => handleLocationChange(e.target.value)}
              className="border border-gray-200 rounded-md p-1"
            />
            {locationError && (
              <p className="text-red-500 text-sm">{locationError}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => handleDateChange(e.target.value)}
              min={minDate}
              className="border border-gray-200 rounded-md p-1"
            />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1 w-full">
          <label className="font-semibold">Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => handleDescriptionChange(e.target.value)}
            className="p-2 border border-gray-200 rounded-md resize-none"
          />
          {descriptionError && (
            <p className="text-red-500 text-sm">{descriptionError}</p>
          )}
        </div>

        {/* Backend error message */}
        {backendError && <p className="text-red-500 text-sm">{backendError}</p>}

        {/* Submit button */}
        <Button type="submit" disabled={!isFormValid()}>
          Submit
        </Button>
      </div>
    </form>
  );
}
