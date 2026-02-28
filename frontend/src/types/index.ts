export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity?: number;
  visibility: 'public' | 'private';
  organizer: User;
  participants: User[];
}

export interface AuthResponse {
  access_token: string;
}
