import { useState } from "react";
import "../../Style/HabitTypes.css";

export default function DurationHabit({ habit, value = 0, goal, onValueChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseInt(tempValue) || 0;
    onValueChange(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value.toString());
    setIsEditing(false);
  };

  const progress = goal ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className="habit-container">
      <span className="habit-name">{habit}</span>
      <div className="habit-controls">
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
            <button className="duration-save-btn" onClick={handleSave}>✓</button>
            <button className="duration-cancel-btn" onClick={handleCancel}>✕</button>
          </div>
        ) : (
          <>
            {goal && (
              <div className="counter-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-text">{value}/{goal} min</span>
              </div>
            )}
            {!goal && (
              <span className="counter-display">{value} min</span>
            )}
            <button className="duration-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}