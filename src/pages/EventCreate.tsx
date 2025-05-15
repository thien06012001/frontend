import CreateForm from '../components/pages/event-create/CreateForm';
import { Link } from 'react-router';

function EventCreate() {
  return (
    <section className="flex bg-white mt-5 border border-gray-200 rounded-md shadow-md flex-col items-center space-y-3 w-full h-full p-4">
      <Link to={'/'} className="self-start flex items-center gap-1 ">
        <span>←</span>
        <span className="underline">Back to homepage</span>
      </Link>

      <h1 className="font-semibold text-3xl">Create Event</h1>

      <CreateForm />
    </section>
  );
}

export default EventCreate;
