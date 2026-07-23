import "../Style/Navbar.css";
import { useState } from "react";

export default function NavBar({
  leftPageView,
  onLeftPageChange,
  rightPageView,
  onRightPageChange,
  user,
}) {
  const leftTabs = ["Habits"];
  const rightTabs = ["Stats", "Glance", "History", "Achievements"];

  return (
    <div className="navbar">
      {/* Left page controls */}
      <div className="nav-left">
        {leftTabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${leftPageView === tab ? "active" : ""}`}
            onClick={() => onLeftPageChange(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Center - Login/Signup */}
      <div className="nav-center">
        { !user && <button
          className="nav-auth-combined"
          onClick={() => {
            onLeftPageChange("login");
            onRightPageChange("signup");
          }}
        >
          Login / Sign Up
        </button>}
        {user && <button
        className="nav-auth-combined"
        onClick={() => {
            onLeftPageChange("profile");
            onRightPageChange("profile");
          }}
        >
          Profile
        </button>}
      </div>

      {/* Right page controls */}
      <div className="nav-right">
        {rightTabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${rightPageView === tab ? "active" : ""}`}
            onClick={() => onRightPageChange(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
