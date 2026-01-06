import "./App.css";
import NavBar from "./Components/Navbar";

export default function App() {
  return (
    <div className="app">
      <NavBar />

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

