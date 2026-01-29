import "../../Style/HabitTypes.css";

export default function CheckboxHabit({ name, completed, onToggle, hasTags, tag, availableTags, onTagChange }) {
  return (
    <div className="habit-container">
      <span className="habit-name">{name}</span>
      <div className="habit-controls">
        {hasTags && availableTags && availableTags.length > 0 && (
          <select 
            value={tag || ""} 
            onChange={(e) => onTagChange(e.target.value)}
            className="habit-tag-select"
          >
            <option value="">Select tag...</option>
            {availableTags.map((availableTag) => (
              <option key={availableTag} value={availableTag}>
                {availableTag}
              </option>
            ))}
          </select>
        )}
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