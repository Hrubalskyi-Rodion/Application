import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, joinEvent, leaveEvent, deleteEvent } from '../services/eventsService';
import { useAuthStore } from '../store/authStore';
import type { Event } from '../types';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getEvent(+id).then(setEvent);
  }, [id]);

  if (!event) return <div className="text-center py-20">Loading...</div>;

  const isOrganizer = user?.id === event.organizer.id;
  const isJoined = user ? event.participants.some((p) => p.id === user.id) : false;
  const isFull = event.capacity ? event.participants.length >= event.capacity : false;

  const handleJoin = async () => {
    if (!token) return navigate('/login');
    const updated = await joinEvent(event.id);
    setEvent(updated);
  };

  const handleLeave = async () => {
    const updated = await leaveEvent(event.id);
    setEvent(updated);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(event.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-indigo-600 mb-4">
        ← Back
      </button>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          {isOrganizer && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/events/${event.id}/edit`)}
                className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="text-sm text-gray-600 flex flex-col gap-1 mb-6">
          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
          <span>🕐 {new Date(event.date).toLocaleTimeString()}</span>
          <span>📍 {event.location}</span>
          <span>
            👥 {event.participants.length}
            {event.capacity ? ` / ${event.capacity}` : ''} participants
          </span>
          <span>🎤 Organizer: {event.organizer.name}</span>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Participants</h2>
          {event.participants.length === 0 ? (
            <p className="text-gray-400 text-sm">No participants yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {event.participants.map((p) => (
                <span
                  key={p.id}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
        {!isOrganizer &&
          (isFull ? (
            <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg">
              Full
            </button>
          ) : isJoined ? (
            <button
              onClick={handleLeave}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Leave Event
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Join Event
            </button>
          ))}
      </div>
    </div>
  );
}
