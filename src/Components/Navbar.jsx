import "../Style/Navbar.css";
import { useState } from "react";

export default function NavBar({ activeTab, onTabChange }) {
  const tabs = ["Daily", "Weekly", "Notes"];

  return (
    <div className="navbar">
      <div className="nav-left">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="nav-auth">Login</button>
        <button className="nav-auth primary">Sign Up</button>
      </div>
    </div>
  );
}
