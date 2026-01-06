import { useState } from "react";
import "./App.css";
import "./Style/NavBar.css"
import NavBar from "./Components/NavBar";
import DailyPage from "./Components/DailyPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("Daily");

  return (
    <div className="app">
      <div className="notebook-container">
        <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="notebook">
          {activeTab === "Daily" && <DailyPage />} {/* render full page */}
        </div>
      </div>
    </div>
  );
}
