import "../../Style/HabitTypes.css";

export default function CheckNoteHabit({
  id,
  name,
  completed,
  onToggle,
  textValue = "",
  onTextChange,
  hasTags,
  tag,
  availableTags,
  onTagChange,
  onEdit,
  recurrence,
  archived,
}) {
  const habitInfo = {
    id,
    name,
    habitType: "checknote",
    hasTags,
    availableTags,
    recurrence,
    archived,
  };

  return (
    <div className="habit-container habit-container--stacked">
      <div className="habit-container-row">
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
      {completed && (
        <input
          type="text"
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Add a note (optional)..."
          className="habit-note-input"
        />
      )}
    </div>
  );
}
