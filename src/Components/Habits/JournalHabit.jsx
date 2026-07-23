import "../../Style/HabitTypes.css";

export default function JournalHabit({
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
    habitType: "journal",
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
      <textarea
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Write today's journal entry..."
        className="habit-journal-textarea"
        rows={4}
      />
    </div>
  );
}
