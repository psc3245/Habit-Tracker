import "../../Style/HabitTypes.css";

const FACES = ["😞", "🙁", "😐", "🙂", "😄"];

export default function RatingHabit({
  id,
  name,
  value = 3,
  hasTags,
  tag,
  availableTags,
  onValueChange,
  onTagChange,
  onEdit,
  recurrence,
  archived,
}) {
  const habitInfo = {
    id,
    name,
    habitType: "rating",
    target: 5,
    hasTags,
    availableTags,
    recurrence,
    archived,
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
        <div className="rating-faces">
          {FACES.map((face, i) => {
            const faceValue = i + 1;
            return (
              <button
                key={faceValue}
                type="button"
                className={`rating-face-btn${value === faceValue ? " selected" : ""}`}
                onClick={() => onValueChange(faceValue)}
                title={`${faceValue} / 5`}
              >
                {face}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
