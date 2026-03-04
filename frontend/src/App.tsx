import { Routes, Route, Navigate } from 'react-router-dom';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';
import EditEvent from './pages/EditEvent';

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create" element={token ? <CreateEvent /> : <Navigate to="/login" />} />
        <Route path="/my-events" element={token ? <MyEvents /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id/edit" element={token ? <EditEvent /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
