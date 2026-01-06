import { useState } from "react";
import "./App.css";
import NavBar from "./Components/Navbar";
import DailyPage from "./Components/DailyPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("Daily");

  return (
    <div className="app">
      <div className="app-container">
        {/* Notebook with navbar inside the brown border */}
        <div className="notebook">
          {/* Navbar inside notebook */}
          <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Page and spine */}
          <div className="notebook-content">
            <div className="page">
              <div className="page-content">
                {activeTab === "Daily" && <DailyPage />}
                {/* {activeTab === "Weekly" && <WeeklyPage />} */}
                {/* {activeTab === "Notes" && <NotesPage />} */}
              </div>
            </div>
            <div className="spine" />
          </div>
        </div>
      </div>
    </div>
  );
}