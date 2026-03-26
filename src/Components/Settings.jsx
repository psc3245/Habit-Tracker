import { useState } from "react";
import "../Style/Settings.css";

export default function Settings({
  user,
  onLogout,
  setLeftPageView,
  setRightPageView,
  leftPageView,
  rightPageView,
  displayMode,
  setDisplayMode,
  leftDefaultPage,
  setLeftDefaultPage,
  rightDefaultPage,
  setRightDefaultPage,
  defaultHabitType,
  setDefaultHabitType,
}) {
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
    }
  };

  return (
    <div className="settings-div">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <p className="settings-label">Display Mode</p>
        <select
          className="settings-select"
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>

      <div className="settings-section">
        <p className="settings-label">Default Page on Login</p>
        <div className="settings-row">
          <p className="settings-sublabel">Left</p>
          <select
            className="settings-select"
            value={leftDefaultPage}
            onChange={(e) => setLeftDefaultPage(e.target.value)}
          >
            <option value="profile">Profile</option>
            <option value="habits">Habits</option>
          </select>
        </div>
        <div className="settings-row">
          <p className="settings-sublabel">Right</p>
          <select
            className="settings-select"
            value={rightDefaultPage}
            onChange={(e) => setRightDefaultPage(e.target.value)}
          >
            <option value="profile">Profile</option>
            <option value="glance">At A Glance</option>
            <option value="stats">Stats</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <p className="settings-label">Default Habit Type</p>
        <select
          className="settings-select"
          value={defaultHabitType}
          onChange={(e) => setDefaultHabitType(e.target.value)}
        >
          <option value="checkbox">Checkbox</option>
          <option value="counter">Counter</option>
          <option value="duration">Duration</option>
          <option value="slider">Slider</option>
        </select>
      </div>

      <div className="settings-account">
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
        <button onClick={handleDeleteAccount} className="btn-delete-acc">
          <strong>DELETE ACCOUNT</strong>
        </button>
      </div>
    </div>
  );
}
