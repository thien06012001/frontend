// src/components/forms/CreateForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Button from '../../ui/Button';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default function CreateForm() {
  const [eventType, setEventType] = useState<'Public' | 'Private'>('Public');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [endTimeError, setEndTimeError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
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

  const handleSubmit = (e: FormEvent) => {
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

    // TODO: submit form data to your API
    const formData = {
      eventType,
      startTime,
      endTime,
      // …other fields
    };
    console.log('Submitting:', formData);
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
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-400 text-2xl">🖼️</span>
          )}
        </label>

        <div className="flex flex-col gap-2 w-full">
          {/* Note about 24-hour format */}
          <p className="text-sm text-gray-500">
            Enter times in 24-hour format (00:00–23:59)
          </p>

          <label htmlFor="startTime" className="font-semibold">
            Start time (HH:MM)
          </label>
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
