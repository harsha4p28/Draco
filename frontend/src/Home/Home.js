import React from 'react';
import './Home.css';  

const Home = () => {
  return (
    <div>
      <div className='HomeContainer'>
        <div className='HomeMainContainer'>
          <h1>Welcome to DracoBlog</h1>
          <h3>Your space to write, read and connect</h3>
          <div className="HomeButtons">
            <button>Get Started</button>
            <button>Sign In</button> 
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home