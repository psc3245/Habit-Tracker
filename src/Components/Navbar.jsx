export default function NavBar({ activeTab, onTabChange }) {
  const tabs = ["Daily", "Weekly", "Notes"];

  return (
    <div className="navbar">
      <div className="nav-left">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <button className="nav-btn">Login</button>
        <button className="nav-btn">Sign Up</button>
      </div>
    </div>
  );
}
