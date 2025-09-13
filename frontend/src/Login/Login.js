import React, { useState } from "react";
import './Login.css';
import { Link,useNavigate } from "react-router-dom";
import config from "../config"



export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch(`${config.apiUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setFormData({ username: "", password: "" });
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate("/")
                }, 500);
            } else {
                setErrMsg(data.error || "Login failed");
                console.log("Login response:", data);

                setTimeout(() => {
                    setErrMsg('');
                }, 3000);
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong. Please try later.");
        }
    };

    return (
        <div className="page-container">
            <form onSubmit={handleLogin}>
                <div className="login-container">
                    <div className="login-logo">
                        <h2>Login to your dashboard</h2>
                    </div>

                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
                    {success && <p style={{ color: 'green', cursor: "pointer" }}>Login Successful</p>}

                    <button className="submit-btn">
                        Login
                    </button>
                    <p>Don't have an account?<span><Link to="/Register" className="register-link"> Register</Link></span></p>
                </div>
            </form>

            
        </div>
    );
}