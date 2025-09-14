import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Nav from './Nav/Nav';
import Post from './Post/Post';
import Dashboard from './Dashboard/Dashboard';
import { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import config from './config'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      let res = await fetch(`${config.apiUrl}/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setLoggedIn(true);
      } else {
        const refreshRes = await fetch(`${config.apiUrl}/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshRes.ok) {
          res = await fetch(`${config.apiUrl}/me`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
            setUser({});
          }
        } else {
          setLoggedIn(false);
          setUser({});
        }
      }
    } catch {
      setLoggedIn(false);
      setUser({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <ClipLoader size={50} color="#36d7b7" />
    </div>
  );

  return (
    <Router>
      <Nav loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/" element={loggedIn ? <Dashboard /> : <Home />} />
        <Route path="/login" element={!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/register" element={!loggedIn ? <Register /> : <Navigate to="/" />} />
        <Route path="/addPost" element={loggedIn ? <Post /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;