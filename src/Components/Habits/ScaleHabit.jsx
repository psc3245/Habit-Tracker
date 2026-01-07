import "../../Style/HabitTypes.css";

export default function ScaleHabit({ habit, value = 5, min = 1, max = 10, onValueChange }) {
  return (
    <div className="habit-container">
      <span className="habit-name">{habit}</span>
      <div className="habit-controls">
        <div className="scale-container">
          <span className="scale-label">{min}</span>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value))}
            className="scale-slider"
          />
          <span className="scale-label">{max}</span>
          <span className="scale-value">{value}</span>
        </div>
      </div>
    </div>
  );
}