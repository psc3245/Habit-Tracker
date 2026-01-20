import { useState } from "react";
import "../../Style/Login.css";

export function onLoginRequest({username, password}) {
    
}

export default function LoginMenu() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const loginData = {
        username: username.trim(),
        password: password,
      };

      onLoginRequest(loginData);
      
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
      <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>
          <button type="submit" className="btn-login">
              Login
          </button>
      </form>
    </div>
  )

};