import "./App.css";
import Habit from "./Components/Habit";

export default function App() {
  return (
    <div className="app">
      <div className="top-tabs">
        <div className="tab active">Daily</div>
        <div className="tab">Weekly</div>
        <div className="tab">Notes</div>
      </div>

      <div className="notebook">
        <div className="page left">
          <h2>Habits</h2>
        </div>

        <div className="spine" />

        <div className="page right">
          <h2>Today</h2>
        </div>
      </div>
    </div>
  );
}

