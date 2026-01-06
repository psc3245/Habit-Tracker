import { useState } from "react";
import "../Style/NavBar.css";

export default function NavBar() {
  const [activeTab, setActiveTab] = useState("Daily");

  const tabs = ["Daily", "Weekly", "Notes"];

  return (
    <nav className="navbar">
      <div className="nav-left">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <button className="nav-auth">Login</button>
        <button className="nav-auth primary">Sign Up</button>
      </div>
    </nav>
  );
}
