import { useState } from "react";
import "./App.css";
import NavBar from "./Components/Navbar";
import HabitsPage from "./Components/HabitsPage.jsx";
import LoginMenu from "./Components/Login/LoginMenu.jsx";
import SignUpMenu from "./Components/Login/SignUpMenu.jsx";
import ProfileLeft from "./Components/Profile/ProfileLeft.jsx";
import ProfileRight from "./Components/Profile/ProfileRight.jsx";
import AtAGlance from "./Components/AtAGlance.jsx";
import * as HabitHelper from "./Helpers/HabitHelper.js";
import Home from "./Components/HomePage/Home.jsx";
import Info from "./Components/HomePage/Info.jsx";
import Stats from "./Components/Stats.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [leftPageView, setLeftPageView] = useState("Home");
  const [rightPageView, setRightPageView] = useState("Info");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [displayMode, setDisplayMode] = useState("light");
  const [leftDefaultPage, setLeftDefaultPage] = useState("profile");
  const [rightDefaultPage, setRightDefaultPage] = useState("profile");
  const [defaultHabitType, setDefaultHabitType] = useState("checkbox");

  const onLoginSuccess = (user) => {
    setUser({ ...user, id: user.user_id });
    setLeftPageView("Profile");
    setRightPageView("Profile");
    setSelectedDate(new Date());
  };

  const onLogout = () => {
    setUser(null);
    setLeftPageView("Login");
    setRightPageView("SignUp");
    setSelectedDate(new Date());
  };

  return (
    <div className="app">
      <div className="app-container">
        <button
          className="header"
          onClick={() => {
            setLeftPageView("Home");
            setRightPageView("Info");
          }}
        >
          {" "}
          HABIT TRACKER{" "}
        </button>
        {/* Notebook inside */}
        <div className="notebook">
          <NavBar
            leftPageView={leftPageView}
            onLeftPageChange={setLeftPageView}
            rightPageView={rightPageView}
            onRightPageChange={setRightPageView}
            user={user}
          />

          {/* Two-page spread */}
          <div className="notebook-content">
            {/* Left page */}
            <div className="page left-page">
              <div className="page-content">
                {leftPageView === "Home" && <Home user={user} />}{" "}
                {leftPageView === "Habits" && (
                  <HabitsPage
                    user={user}
                    onCreateHabit={HabitHelper.onCreateHabit}
                    onUpdateHabit={HabitHelper.onUpdateHabit}
                    getHabitsByUserId={HabitHelper.getHabitsByUserId}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                )}
                {leftPageView === "Login" && (
                  <LoginMenu onLoginSuccess={onLoginSuccess} />
                )}
                {leftPageView === "Profile" && user && (
                  <ProfileLeft
                    user={user}
                    setUser={setUser}
                    onLogout={onLogout}
                  />
                )}
              </div>
            </div>

            {/* Spine */}
            <div className="spine" />

            {/* Right page */}
            <div className="page right-page">
              <div className="page-content">
                {rightPageView === "Info" && <Info user={user} />}
                {rightPageView === "Stats" && (
                  <div className="placeholder-page">
                    <Stats user={user} />
                  </div>
                )}
                {rightPageView === "Glance" && (
                  <div className="placeholder-page">
                    <AtAGlance user={user} selectedDate={selectedDate} />
                  </div>
                )}
                {rightPageView === "SignUp" && (
                  <SignUpMenu onSignUpSuccess={onLoginSuccess} />
                )}
                {rightPageView === "Profile" && user && (
                  <ProfileRight
  user={user}
  onLogout={onLogout}
  setLeftPageView={setLeftPageView}
  setRightPageView={setRightPageView}
  leftPageView={leftPageView}
  rightPageView={rightPageView}
  displayMode={displayMode}
  setDisplayMode={setDisplayMode}
  leftDefaultPage={leftDefaultPage}
  setLeftDefaultPage={setLeftDefaultPage}
  rightDefaultPage={rightDefaultPage}
  setRightDefaultPage={setRightDefaultPage}
  defaultHabitType={defaultHabitType}
  setDefaultHabitType={setDefaultHabitType}
/>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
