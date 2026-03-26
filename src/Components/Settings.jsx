import { useState } from "react";
import "../Style/Settings.css";

export default function Settings({ user, onLogout }) {
  const [displayMode, setDisplayMode] = useState("light");
  const [leftDefaultPage, setLeftDefaultPage] = useState("profile");
  const [rightDefaultPage, setRightDefaultPage] = useState("profile");
  const [defaultHabitType, setDefaultHabitType] = useState("checkbox");

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
    }
  };

  return (
    <div className="settings-div">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <p className="settings-label">Display Mode</p>
        <select className="settings-select" value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>

      <div className="settings-section">
        <p className="settings-label">Default Page on Login</p>
        <div className="settings-row">
          <p className="settings-sublabel">Left</p>
          <select className="settings-select" value={leftDefaultPage} onChange={(e) => setLeftDefaultPage(e.target.value)}>
            <option value="habits">Habits</option>
            <option value="profile">Profile</option>
          </select>
        </div>
        <div className="settings-row">
          <p className="settings-sublabel">Right</p>
          <select className="settings-select" value={rightDefaultPage} onChange={(e) => setRightDefaultPage(e.target.value)}>
            <option value="glance">At A Glance</option>
            <option value="stats">Stats</option>
            <option value="profile">Profile</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <p className="settings-label">Default Habit Type</p>
        <select className="settings-select" value={defaultHabitType} onChange={(e) => setDefaultHabitType(e.target.value)}>
          <option value="checkbox">Checkbox</option>
          <option value="counter">Counter</option>
          <option value="duration">Duration</option>
          <option value="slider">Slider</option>
        </select>
      </div>

      <div className="settings-account">
        <button onClick={onLogout} className="btn-logout">Logout</button>
        <button onClick={handleDeleteAccount} className="btn-delete-acc">Delete Account</button>
      </div>
    </div>
  );
}