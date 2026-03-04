import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, updateEvent } from '../services/eventsService';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      getEvent(+id).then((event) => {
        setTitle(event.title);
        setDescription(event.description);
        setDate(new Date(event.date).toISOString().split('T')[0]);
        setTime(new Date(event.date).toTimeString().slice(0, 5));
        setLocation(event.location);
        setCapacity(event.capacity ? String(event.capacity) : '');
        setVisibility(event.visibility);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) {
      setError('Title, date and location are required');
      return;
    }
    const dateTime = new Date(`${date}T${time || '00:00'}`);
    try {
      await updateEvent(+id!, {
        title,
        description,
        date: dateTime.toISOString(),
        location,
        capacity: capacity ? +capacity : undefined,
        visibility,
      });
      navigate(`/events/${id}`);
    } catch {
      setError('Failed to update event');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-indigo-600 mb-4">
        ← Back
      </button>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-2">Edit Event</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
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
              <label className="text-sm font-medium">Time</label>
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Capacity (optional)</label>
            <input
              type="number"
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
                Public
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                />
                Private
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
