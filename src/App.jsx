import { useState } from "react";
import "./App.css";
import NavBar from "./Components/Navbar";
import DailyPage from "./Components/DailyPage";
import WeeklyPage from "./Components/WeeklyPage";
import LoginMenu from "./Components/Login/LoginMenu.jsx"
import SignUpMenu from "./Components/Login/SignUpMenu.jsx";

export default function App() {
  const [leftPageView, setLeftPageView] = useState("Daily");
  const [rightPageView, setRightPageView] = useState("Stats");

  return (
    <div className="app">
      <div className="app-container">
        {/* Notebook inside */}
        <div className="notebook">
          <NavBar 
            leftPageView={leftPageView}
            onLeftPageChange={setLeftPageView}
            rightPageView={rightPageView}
            onRightPageChange={setRightPageView}
          />
          
          {/* Two-page spread */}
          <div className="notebook-content">
            {/* Left page - Daily or Weekly */}
            <div className="page left-page">
              <div className="page-content">
                {leftPageView === "Daily" && <DailyPage />}
                {leftPageView === "Weekly" && <WeeklyPage />}
                {leftPageView == "Login" && <LoginMenu/>}
              </div>
            </div>
            
            {/* Spine */}
            <div className="spine" />
            
            {/* Right page - Stats or Glance */}
            <div className="page right-page">
              <div className="page-content">
                {rightPageView === "Stats" && <div className="placeholder-page">
                  <h2 className="page-title">Statistics</h2>
                  <p>Stats and analytics coming soon...</p>
                </div>}
                {rightPageView === "Glance" && <div className="placeholder-page">
                  <h2 className="page-title">At a Glance</h2>
                  <p>Overview coming soon...</p>
                </div>}
                {rightPageView == "SignUp" && <SignUpMenu/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
