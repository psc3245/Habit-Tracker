import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal.jsx";
import * as UserHelper from "../Helpers/UserHelper.js";
import * as SettingsHelper from "../Helpers/SettingsHelper.js";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="settings-div">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <p className="settings-label">Display Mode <i>(Coming Soon)</i></p>
        <select
          className="settings-select"
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <option value="light">Light Mode</option>
          {/* <option value="dark">Dark Mode</option> */}
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
        <button
          onClick={() => {
            SettingsHelper.updateSettings(user.id, {
              display_mode: displayMode,
              left_default_page: leftDefaultPage,
              right_default_page: rightDefaultPage,
              default_habit_type: defaultHabitType,
            });
          }}
          className="btn-logout"
        >
          Save Settings
        </button>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
        <button
          onClick={() => {
            setIsDeleteModalOpen(true);
          }}
          className="btn-delete-acc"
        >
          <strong>DELETE ACCOUNT</strong>
        </button>
      </div>
      {isDeleteModalOpen && (
        <DeleteAccountModal
          user={user}
          onClose={() => {
            setIsDeleteModalOpen(false);
          }}
          handleDeleteAccount={UserHelper.deleteAccount}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
