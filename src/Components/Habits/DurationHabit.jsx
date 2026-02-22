import { useState, useEffect } from "react";
import "../../Style/HabitTypes.css";

export default function DurationHabit({
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
    habitType : "duration",
    target,
    hasTags,
    availableTags,
  recurrence,

  };
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  useEffect(() => {
    setTempValue(value.toString());
  }, [value]);

  const handleSave = () => {
    const numValue = parseInt(tempValue) || 0;
    onValueChange(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value.toString());
    setIsEditing(false);
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

        {isEditing ? (
          <div className="duration-edit">
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="duration-input"
              autoFocus
              min="0"
            />
            <span className="duration-unit">min</span>
            <button className="duration-save-btn" onClick={handleSave}>
              ✓
            </button>
            <button className="duration-cancel-btn" onClick={handleCancel}>
              ✕
            </button>
          </div>
        ) : (
          <div className="duration-display-group">
            <span className="duration-value">
              {value} / {target} min
            </span>
            <button
              className="duration-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
