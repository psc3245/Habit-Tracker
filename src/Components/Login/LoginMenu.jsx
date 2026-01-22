import { useState } from "react";
import "../../Style/LoginSignUp.css";

const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

export default function LoginMenu({onLoginSuccess}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLoginRequest = async ({ username, password }) => {
    try {
      const res = await fetch(`${backend_base_url}/users/login`, {
        method: "POST", // must be POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pass: password }), // match backend
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }

      const u = await res.json();
      onLoginSuccess(u);
      console.log("Logged in user:", u);
      return u;
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLoginRequest({ username: username.trim(), password });
      setUsername("");
      setPassword("");
    }
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container">
      {(
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn-login">
            Login
          </button>
          {/* <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button> */}
        </form>
      )}
    </div>
  );
}
