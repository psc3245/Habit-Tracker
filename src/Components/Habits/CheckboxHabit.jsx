import "../../Style/HabitTypes.css";

export default function CheckboxHabit({ habit, completed, onToggle }) {
  return (
    <div className="habit-container">
      <span className="habit-name">{habit}</span>
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="habit-checkbox"
      />
    </div>
  );
}