import "../Style/Navbar.css";
import { useState } from "react";

export default function NavBar({
  leftPageView,
  onLeftPageChange,
  rightPageView,
  onRightPageChange,
  user,
}) {
  const leftTabs = ["Daily", "Weekly"];
  const rightTabs = ["Stats", "Glance"];

  return (
    <div className="navbar">
      {/* Left page controls */}
      <div className="nav-left">
        {leftTabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${leftPageView === tab ? "active" : ""}`}
            onClick={() => onLeftPageChange(tab)}
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
            onLeftPageChange("Login");
            onRightPageChange("SignUp");
          }}
        >
          Login / Sign Up
        </button>}
        {user && <button
        className="nav-auth-combined"
        onClick={() => {
            onLeftPageChange("Profile");
            onRightPageChange("Profile");
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
            onClick={() => onRightPageChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
