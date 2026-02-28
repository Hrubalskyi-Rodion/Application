import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, joinEvent, leaveEvent } from '../services/eventsService';
import { useAuthStore } from '../store/authStore';
import type { Event } from '../types';

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const handleJoin = async (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    if (!token) return navigate('/login');
    const updated = await joinEvent(eventId);
    setEvents(events.map((ev) => (ev.id === eventId ? updated : ev)));
  };

  const handleLeave = async (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    const updated = await leaveEvent(eventId);
    setEvents(events.map((ev) => (ev.id === eventId ? updated : ev)));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
      <p className="text-gray-500 mb-6">Find and join exciting events happening around you</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isFull = event.capacity ? event.participants.length >= event.capacity : false;
          const isJoined = user ? event.participants.some((p) => p.id === user.id) : false;

          return (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className="bg-white rounded-xl shadow-sm border p-5 cursor-pointer hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-1">{event.title}</h2>
              <p className="text-gray-500 text-sm mb-3">{event.description}</p>
              <div className="text-sm text-gray-600 flex flex-col gap-1 mb-4">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>🕐 {new Date(event.date).toLocaleTimeString()}</span>
                <span>📍 {event.location}</span>
                <span>
                  👥 {event.participants.length}
                  {event.capacity ? ` / ${event.capacity}` : ''} participants
                </span>
              </div>
              {isFull ? (
                <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg">
                  Full
                </button>
              ) : isJoined ? (
                <button
                  onClick={(e) => handleLeave(e, event.id)}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={(e) => handleJoin(e, event.id)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Join Event
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
