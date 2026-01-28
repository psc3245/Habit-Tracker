import "../../Style/HabitTypes.css";

export default function CheckboxHabit({ name, completed, onToggle }) {
  return (
    <div className="habit-container">
      <span className="habit-name">{name}</span>
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="habit-checkbox"
      />
    </div>
  );
}