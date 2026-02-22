import "../../Style/HabitTypes.css";

export default function CheckboxHabit({
  id,
  name,
  completed,
  onToggle,
  hasTags,
  tag,
  availableTags,
  onTagChange,
  onEdit,
  recurrence,
}) {
  const habitInfo = {
    id,
    name,
    habitType : "checkbox",
    completed,
    hasTags,
    availableTags,
  recurrence,

  };
  return (
    <div className="habit-container">
      <span className="habit-name">{name}</span>

      <div className="habit-controls">
        <button className="btn-edit" onClick={() => onEdit(habitInfo)}>
          Edit
        </button>
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
