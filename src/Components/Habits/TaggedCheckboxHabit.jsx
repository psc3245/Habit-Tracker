import "../../Style/HabitTypes.css";

export default function TaggedCheckboxHabit({ 
  habit, 
  completed, 
  tag, 
  availableTags, 
  onToggle, 
  onTagChange 
}) {
  return (
    <div className="habit-container">
      <span className="habit-name">{habit}</span>
      <div className="habit-controls">
        <select 
          className="habit-tag-select"
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
        >
          <option value="--">--</option>
          {availableTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value="new-tag">+ New Tag</option>
        </select>
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="habit-checkbox"
        />
      </div>
    </div>
  );
}