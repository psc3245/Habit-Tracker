import "../../Style/HabitTypes.css";

export default function CounterHabit({
  id,
  name,
  value = 0,
  target,
  hasTags,
  tag,
  availableTags,
  onValueChange,
  onTagChange,
  onEdit,
  recurrence,

}) {
  const habitInfo = {
    id,
    name,
    habitType : "counter",
    target,
    hasTags,
    availableTags,
  recurrence,

  };
  const increment = () => {
    onValueChange(value + 1);
  };

  const decrement = () => {
    if (value > 0) {
      onValueChange(value - 1);
    }
  };

  const progress = target ? Math.min((value / target) * 100, 100) : 0;

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

        <div className="counter-display-group">
          <span className="counter-value">
            {value} / {target}
          </span>
          <div className="counter-buttons">
            <button className="counter-btn" onClick={decrement}>
              −
            </button>
            <button className="counter-btn" onClick={increment}>
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
