import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventsService';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) {
      setError('Title, date and location are required');
      return;
    }
    const dateTime = new Date(`${date}T${time || '00:00'}`);
    if (dateTime < new Date()) {
      setError('Cannot create events in the past');
      return;
    }
    try {
      const event = await createEvent({
        title,
        description,
        date: dateTime.toISOString(),
        location,
        capacity: capacity ? +capacity : undefined,
        visibility,
      });
      navigate(`/events/${event.id}`);
    } catch {
      setError('Failed to create event');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-indigo-600 mb-4">
        ← Back
      </button>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-2">Create New Event</h1>
        <p className="text-gray-500 mb-6">Fill in the details to create an amazing event</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Event Title *</label>
            <input
              type="text"
              placeholder="e.g., Tech Conference 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea
              placeholder="Describe what makes your event special..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Location *</label>
            <input
              type="text"
              placeholder="e.g., Convention Center, Kyiv"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Capacity (optional)</label>
            <input
              type="number"
              placeholder="Leave empty for unlimited"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Visibility</label>
            <div className="flex flex-col gap-2 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                />
                Public - Anyone can see and join this event
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                />
                Private - Only invited people can see this event
              </label>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
