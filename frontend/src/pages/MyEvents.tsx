import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
// import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getMyEvents } from '../services/eventsService';
import type { Event } from '../types';
import dayjs from 'dayjs';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {},
});

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'month' | 'week'>('month');
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getMyEvents().then(setEvents);
  }, []);

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: `${dayjs(event.date).format('HH:mm')} - ${event.title}`,
    start: new Date(event.date),
    end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000),
  }));

  if (events.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Events</h1>
        <p className="text-gray-500">
          You are not part of any events yet.{' '}
          <span
            onClick={() => navigate('/')}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Explore public events and join.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <div className="flex flex-col justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-gray-500">View and manage your event calendar</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() =>
                  setDate(
                    dayjs(date)
                      .subtract(1, view === 'month' ? 'month' : 'week')
                      .toDate(),
                  )
                }
                className="px-3.5 py-3 hover:bg-gray-100 rounded-xl border border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="-19.04 0 75.803 75.803"
                >
                  <g id="Group_64" data-name="Group 64" transform="translate(-624.082 -383.588)">
                    <path
                      id="Path_56"
                      data-name="Path 56"
                      d="M660.313,383.588a1.5,1.5,0,0,1,1.06,2.561l-33.556,33.56a2.528,2.528,0,0,0,0,3.564l33.556,33.558a1.5,1.5,0,0,1-2.121,2.121L625.7,425.394a5.527,5.527,0,0,1,0-7.807l33.556-33.559A1.5,1.5,0,0,1,660.313,383.588Z"
                      fill="#000000"
                    />
                  </g>
                </svg>
              </button>
              <span className="font-semibold text-lg">{dayjs(date).format('MMMM YYYY')}</span>
              <button
                onClick={() =>
                  setDate(
                    dayjs(date)
                      .add(1, view === 'month' ? 'month' : 'week')
                      .toDate(),
                  )
                }
                className="px-3.5 py-3 hover:bg-gray-100 rounded-xl border border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="-19.04 0 75.804 75.804"
                >
                  <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
                    <path
                      id="Path_57"
                      data-name="Path 57"
                      d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z"
                      fill="#000000"
                    />
                  </g>
                </svg>
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg ${view === 'month' ? 'bg-indigo-600 text-white  border border-indigo-800' : 'bg-gray-100 border border-gray-200'}`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg ${view === 'week' ? 'bg-indigo-600 text-white border border-indigo-800' : 'bg-gray-100 border border-gray-200'}`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          view === 'month'
            ? 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'
            : ''
        }
      >
        {view === 'week' ? (
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = dayjs(date).startOf('week').add(i, 'day');
              const dayEvents = events.filter((e) => dayjs(e.date).isSame(day, 'day'));
              const isToday = day.isSame(dayjs(), 'day');

              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl border p-3 min-h-40 ${isToday ? 'border-indigo-400 border-2' : 'border-gray-200'}`}
                >
                  <div className="text-sm text-gray-500 font-medium">{day.format('ddd')}</div>
                  <div className={`text-lg font-semibold mb-2 ${isToday ? 'text-indigo-600' : ''}`}>
                    {day.format('D')}
                  </div>
                  {dayEvents.length === 0 ? (
                    <div className="text-xs text-gray-400">No events</div>
                  ) : (
                    dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-indigo-100 text-indigo-700 rounded-lg p-2 text-xs cursor-pointer mb-1"
                      >
                        <div className="font-medium">{dayjs(event.date).format('HH:mm')}</div>
                        <div>{event.title}</div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            view={view}
            onView={(newView) => setView(newView as 'month' | 'week')}
            style={{ height: 600 }}
            onSelectEvent={(event) => navigate(`/events/${event.id}`)}
            toolbar={false}
            date={date}
            onNavigate={(d) => setDate(d)}
          />
        )}
      </div>
    </div>
  );
}
