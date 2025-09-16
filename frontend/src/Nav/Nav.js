import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchPosts } from "../features/postsSlice";
import logo from "../Assets/logo.png";
import "./Nav.css";
import profile from "../Assets/profile.jpg";

const Nav = ({ loggedIn, setLoggedIn }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      dispatch(searchPosts(searchQuery));
    }
  };

  return (
    <div className="navContainer">
      <div className="navMainContainer">
        <div className="navLogo">
          <Link to="/">
            <img src={logo} alt="DracoBlog" />
          </Link>
          <h2>DracoBlog</h2>
        </div>

        <form className="navSearch" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {!loggedIn ? (
          <div className="navButtons">
            <Link to="/login">
              <button className="btn loginBtn">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn registerBtn">Register</button>
            </Link>
          </div>
        ) : (
          <div className="navProfile">
            <Link to="/profile">
              <img src={profile} alt="profile" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
