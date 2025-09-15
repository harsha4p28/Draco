import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Assets/logo.png'
import './Nav.css'
import profile from '../Assets/profile.jpg'

const Nav = ({loggedIn,setLoggedIn}) => {
  return (
    <div className='navContainer'>
      <div className='navMainContainer'>
        <div className='navLogo'>
          <Link to='/'>
          <img src={logo} alt='DracoBlog'/>
            </Link>
          <h2>DracoBlog</h2>
        </div>

        <div className='navSearch'>
          <input type='text' placeholder='Search...'/>
        </div>

        <div className='navLinks'>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/contact'>Contact</Link>
        </div>
        
        {!loggedIn ? <div className='navButtons'>
          <Link to='/login'>
            <button className='btn loginBtn'>Login</button>
          </Link>
          <Link to='/register'>
            <button className='btn registerBtn'>Register</button>
          </Link>
        </div>:
          <div className='navProfile'>
            <Link to='/profile'>
              <img src={profile} alt='profile'/>
            </Link>
          </div>
        }

        
      </div>
    </div>
  )
}

export default Nav