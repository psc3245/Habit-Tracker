import "../../Style/HabitTypes.css";

export default function ShortTextHabit({
  id,
  name,
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
    habitType: "shorttext",
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
        </div>
      </div>
      <input
        type="text"
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Write today's entry..."
        className="habit-note-input"
      />
    </div>
  );
}
