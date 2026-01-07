import "../../Style/HabitTypes.css";

export default function CounterHabit({ habit, value = 0, goal, onValueChange }) {
  const increment = () => {
    onValueChange(value + 1);
  };

  const decrement = () => {
    if (value > 0) {
      onValueChange(value - 1);
    }
  };

  const progress = goal ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className="habit-container">
      <span className="habit-name">{habit}</span>
      <div className="habit-controls">
        {goal && (
          <div className="counter-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{value}/{goal}</span>
          </div>
        )}
        {!goal && (
          <span className="counter-display">{value}</span>
        )}
        <div className="counter-buttons">
          <button className="counter-btn" onClick={decrement}>−</button>
          <button className="counter-btn" onClick={increment}>+</button>
        </div>
      </div>
    </div>
  );
}