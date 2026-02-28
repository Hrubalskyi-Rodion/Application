import api from './api';
import type { Event } from '../types';

export const getEvents = async () => {
  const response = await api.get<Event[]>('/events');
  return response.data;
};

export const getEvent = async (id: number) => {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
};

export const createEvent = async (data: Partial<Event>) => {
  const response = await api.post<Event>('/events', data);
  return response.data;
};

export const updateEvent = async (id: number, data: Partial<Event>) => {
  const response = await api.patch<Event>(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  await api.delete(`/events/${id}`);
};

export const joinEvent = async (id: number) => {
  const response = await api.post<Event>(`/events/${id}/join`);
  return response.data;
};

export const leaveEvent = async (id: number) => {
  const response = await api.post<Event>(`/events/${id}/leave`);
  return response.data;
};

export const getMyEvents = async () => {
  const response = await api.get<Event[]>('/events/user/my-events');
  return response.data;
};
