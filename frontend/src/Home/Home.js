import React from 'react';
import './Home.css';  
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';

const Home = () => {
  return (
    <div>
      <div className='HomeContainer'>
        <div className='HomeMainContainer'>
          <h1>Welcome to DracoBlog</h1>
          <h3>Your space to write, read and connect</h3>
          <div className="HomeButtons">
            <Link to="/register">
              <button>Get Started</button>
            </Link>
            <Link to="/login">
              <button>Sign In</button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home