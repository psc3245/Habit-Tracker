import { useState, useEffect } from "react";
import DeleteAccountModal from "./DeleteAccountModal.jsx";
import * as UserHelper from "../Helpers/UserHelper.js";
import * as SettingsHelper from "../Helpers/SettingsHelper.js";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import { HABIT_TYPE_LABELS } from "../Helpers/HabitHelper.js";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import * as ReminderHelper from "../Helpers/ReminderHelper.js";
import "../Style/Settings.css";

function toCSV(habits, completions) {
  const header = [
    "habit_name",
    "habit_type",
    "date",
    "value",
    "text_value",
    "selected_tag",
  ];
  const rows = completions.map((c) => {
    const habit = habits.find((h) => h.id === c.habit_id);
    return [
      habit ? habit.name : c.habit_id,
      habit ? habit.type : "",
      c.date,
      c.value ?? "",
      c.text_value ?? "",
      c.selected_tag ?? "",
    ]
      .map((field) => `"${String(field).replaceAll('"', '""')}"`)
      .join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
  const [isExporting, setIsExporting] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("18:00");
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported",
  );

  useEffect(() => {
    if (!user) return;
    const settings = ReminderHelper.getReminderSettings(user.id);
    setReminderEnabled(settings.enabled);
    setReminderTime(settings.time);
  }, [user?.id]);

  const saveReminderSettings = (next) => {
    ReminderHelper.setReminderSettings(user.id, next);
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
  };

  const handleExport = async (format) => {
    if (!user) return;
    setIsExporting(true);
    try {
      const [rawHabits, completions] = await Promise.all([
        HabitHelper.getHabitsByUserId(user.id),
        CompletionHelper.getCompletionsByUserId(user.id),
      ]);
      const habits = rawHabits.map(HabitHelper.mapHabit);

      if (format === "json") {
        downloadFile(
          `habit-tracker-export-${user.username}.json`,
          JSON.stringify({ habits, completions }, null, 2),
          "application/json",
        );
      } else {
        downloadFile(
          `habit-tracker-export-${user.username}.csv`,
          toCSV(habits, completions),
          "text/csv",
        );
      }
    } finally {
      setIsExporting(false);
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
            <option value="history">History</option>
            <option value="achievements">Achievements</option>
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
          {Object.entries(HABIT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-section">
        <p className="settings-label">Reminders</p>
        {notifPermission !== "granted" ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={requestNotificationPermission}
          >
            Enable browser notifications
          </button>
        ) : (
          <>
            <label className="settings-row settings-checkbox-row">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => {
                  setReminderEnabled(e.target.checked);
                  saveReminderSettings({
                    enabled: e.target.checked,
                    time: reminderTime,
                  });
                }}
              />
              Remind me about incomplete habits
            </label>
            {reminderEnabled && (
              <div className="settings-row">
                <p className="settings-sublabel">At</p>
                <input
                  type="time"
                  className="settings-select"
                  value={reminderTime}
                  onChange={(e) => {
                    setReminderTime(e.target.value);
                    saveReminderSettings({
                      enabled: reminderEnabled,
                      time: e.target.value,
                    });
                  }}
                />
              </div>
            )}
            <p className="settings-hint">
              Only fires while this app is open in a browser tab.
            </p>
          </>
        )}
      </div>

      <div className="settings-section">
        <p className="settings-label">Export Your Data</p>
        <div className="settings-row">
          <button
            type="button"
            className="btn-secondary"
            disabled={isExporting}
            onClick={() => handleExport("json")}
          >
            Download JSON
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={isExporting}
            onClick={() => handleExport("csv")}
          >
            Download CSV
          </button>
        </div>
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
