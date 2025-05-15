// src/components/forms/CreateForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import Button from '../../ui/Button';
import { handleAPI } from '../../../handlers/api-handler';
import useUser from '../../../hooks/redux/useUser';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default function CreateForm() {
  const [eventType, setEventType] = useState<'Public' | 'Private'>('Public');
  const [startTime, setStartTime] = useState('');
  const [name, setName] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [capacity, setCapacity] = useState<number | undefined>();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<FormData | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const user = useUser();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileInput working!');
    const files = e.target.files;

    if (files) {
      const formData = new FormData();
      formData.append('my-image-file', files[0], files[0].name);
      setImage(files[0]);
      setImageFile(formData);
    }
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    if (!value || timeRegex.test(value)) {
      setStartTimeError('');
    } else {
      setStartTimeError('Invalid time format (HH:MM)');
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    if (!value || timeRegex.test(value)) {
      setEndTimeError('');
    } else {
      setEndTimeError('Invalid time format (HH:MM)');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!timeRegex.test(startTime)) {
      setStartTimeError('Invalid time format (HH:MM)');
      valid = false;
    }
    if (!timeRegex.test(endTime)) {
      setEndTimeError('Invalid time format (HH:MM)');
      valid = false;
    }
    if (!valid) return;
    const userId = user.id;
    // Convert eventType to isPublic boolean
    const isPublic = eventType === 'Public';

    const uploadRes = await fetch('http://localhost:5000/image-upload', {
      method: 'POST',
      body: imageFile,
    });

    if (!uploadRes.ok) {
      console.error('Failed to upload image');
      return;
    }

    const uploadData = await uploadRes.json();

    const url = uploadData.url;

    const formData = {
      name,
      start_time: `${date}T${startTime}:00`, // ISO-like string
      end_time: `${date}T${endTime}:00`,
      owner_id: userId,
      is_public: isPublic,
      location,
      capacity: capacity || 0,
      image_url: url, // optional, only if your model supports it
    };

    const res = await handleAPI('/events', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();
    const data = result.data;

    window.location.href = `/event/${data.id}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 w-full space-x-4">
      {/* Left side: image preview & time inputs */}
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
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Time</label>
          <input
            id="startTime"
            type="text"
            placeholder="e.g. 14:30"
            value={startTime}
            onChange={e => handleStartTimeChange(e.target.value)}
            className="border border-gray-200 rounded-md p-1"
          />
          {startTimeError && (
            <p className="text-red-500 text-sm">{startTimeError}</p>
          )}

          <label htmlFor="endTime" className="font-semibold">
            End time (HH:MM)
          </label>
          <input
            id="endTime"
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

      {/* Right side: other event fields */}
      <div className="flex flex-1 flex-col space-y-4">
        {/* Event type (radio buttons) */}
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
            <label htmlFor="name" className="font-semibold">
              Event name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              id="name"
              type="text"
              className="border border-gray-200 rounded-md p-1"
              placeholder="Enter the name of your event"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="capacity" className="font-semibold">
              Event capacity
            </label>
            <input
              id="capacity"
              type="number"
              className="border border-gray-200 rounded-md p-1"
              placeholder="Event capacity"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Location & date */}
        <div className="flex w-full space-x-5">
          <div className="flex flex-col space-y-1 flex-1">
            <label htmlFor="location" className="font-semibold">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="border border-gray-200 rounded-md p-1"
              placeholder="Enter the location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="date" className="font-semibold">
              Date
            </label>
            <input
              id="date"
              type="date"
              className="border border-gray-200 rounded-md p-1"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1 w-full">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description"
            className="p-2 border border-gray-200 rounded-md resize-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <Button type="submit" disabled={!!startTimeError || !!endTimeError}>
          Submit
        </Button>
      </div>
    </form>
  );
}
