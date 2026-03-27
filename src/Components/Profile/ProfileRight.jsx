import "../../Style/Profile.css";
import Settings from "../Settings.jsx";

export default function ProfileRight({
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
  if (!user) return null;

  return (
    <Settings
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
  );
}
