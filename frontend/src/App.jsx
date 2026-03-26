import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import DestinationDetails from './pages/DestinationDetails';

function App() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-eco-green text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-wider">
            GreenDestinations
          </Link>
          <nav>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-eco-dark hover:bg-gray-800 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-eco-light transition">Login</Link>
                <Link to="/register" className="bg-eco-accent hover:bg-green-400 px-4 py-2 rounded transition">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/results" element={<Results />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
        </Routes>
      </main>

      <footer className="bg-eco-dark text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} GreenDestinations. Minimal Footprint, Maximum Experience.</p>
      </footer>
    </div>
  );
}

export default App;
