import React from 'react';
import Button from '../../ui/Button';

function CreateForm() {
  return (
    <form className="flex flex-1 w-full">
      <div className="flex flex-col items-start space-y-2.5">
        <label className="w-40 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
          <input type="file" className="hidden" />
          <span className="text-gray-400 text-2xl">🖼️</span>
        </label>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Time</label>
          <input
            type="text"
            placeholder="Start time"
            className="border border-gray-200 rounded-md p-1"
          />
          <input
            type="text"
            placeholder="End time"
            className="border border-gray-200 rounded-md p-1"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-start ml-4 space-y-3">
        <div className="flex items-center space-x-1">
          <input type="checkbox" id="checkbox" />
          <label htmlFor="checkbox" className="font-semibold">
            Private Event
          </label>
        </div>
        <div className="flex w-full space-x-5">
          <div className="flex flex-col space-y-1 flex-1">
            <label htmlFor="name" className="font-semibold">
              Event name
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-md p-1"
              id="name"
              placeholder="Enter the name of your event"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="capacity" className="font-semibold">
              Event capacity
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-md p-1"
              id="capacity"
              placeholder="Event capacity"
            />
          </div>
        </div>
        <div className="flex w-full space-x-5">
          <div className="flex flex-col space-y-1 flex-1">
            <label htmlFor="location" className="font-semibold">
              Location
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-md p-1"
              id="location"
              placeholder="Enter the name of your event"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="date" className="font-semibold">
              Date
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-md p-1"
              id="date"
              placeholder="Event date"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <textarea
            name=""
            id="description"
            placeholder="Description"
            className="p-2 border border-gray-200 rounded-md resize-none"
          ></textarea>
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

export default CreateForm;
