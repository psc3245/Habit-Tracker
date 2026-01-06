import "./App.css";
import Habit from "./Components/Habit";

export default function App() {
  return (
    <div className="notebook">
      <div className="tabs">
        <div className="tab active">Today</div>
        <div className="tab">Week</div>
        <div className="tab">Notes</div>
      </div>

      <h1>Habit Tracker</h1>
      <Habit />
    </div>
  );
}

