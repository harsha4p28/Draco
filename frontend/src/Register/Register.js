import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from 'react-router-dom';
import config from "../config";

export default function Register() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/;

    if (!emailRegex.test(formData.email)) {
      setErrMsg("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!usernameRegex.test(formData.username)) {
      setErrMsg("Username should be 2-20 characters, letters, numbers or underscores only");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful!");
        navigate("/login");
      } else {
        setErrMsg(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setErrMsg("Failed to register. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleRegister}>
        <div className="Register-container">
          <div className="login-logo">
            <h2>Create Your Dashboard - In Just One Click!</h2>
          </div>

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
          {success && <p style={{ color: "green", cursor: "pointer" }}>{success}</p>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="login-pass">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">Login</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
