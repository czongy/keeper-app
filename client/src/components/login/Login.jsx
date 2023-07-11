import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [resMessage, setResMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("https://keeperappczy-api.onrender.com/", {
      method: "POST",      
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
      credentials: "include"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
        return response.json();
      })
      .then((json) => {
        if (!json.success) {
          setResMessage(json.errorJson.message);
        } else {
          setResMessage(json.message);
          setTimeout(() => navigate("/app"), 1500);
        }
      })
      .catch((err) => console.log("Fetch error", err))
  }

  return (
    <div>
      <form className="login" onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"/>
        <button type="submit">Login</button>
        <a href="./register">Register</a>
        <div className="res-msg">
          {resMessage && <p>{resMessage}</p>}
        </div>
      </form>
      <div className="login-footer">
        <em>Note to user: There will be delay in the response of the first request after a period of inactivity while the instance spins up.
        <br />
        The frontend of Keeper app is created as part of The App Brewery course.
        I have enhanced the Keeper app by implementing the backend using Node.js, Mongoose, and Passport.</em>
      </div>
    </div>
  );
}

export default Login;