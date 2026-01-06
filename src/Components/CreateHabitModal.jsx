import { useState } from "react";
import "../Style/CreateHabitModal.css";

export default function CreateHabitModal({ isOpen, onClose, onCreateHabit, availableTags }) {
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("checkbox");
  const [selectedTags, setSelectedTags] = useState([]);
  const [dailyRequirement, setDailyRequirement] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      const habitData = {
        name: habitName.trim(),
        type: habitType
      };

      // Add type-specific data
      if (habitType === "checkbox-with-tags") {
        habitData.tags = selectedTags;
      } else if (habitType === "numerical") {
        habitData.dailyRequirement = parseInt(dailyRequirement) || 0;
      }

      onCreateHabit(habitData);
      
      // Reset form
      setHabitName("");
      setHabitType("checkbox");
      setSelectedTags([]);
      setDailyRequirement("");
      onClose();
    }
  };

  const handleCancel = () => {
    setHabitName("");
    setHabitType("checkbox");
    setSelectedTags([]);
    setDailyRequirement("");
    onClose();
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Habit</h2>
          <select
            value={habitType}
            onChange={(e) => setHabitType(e.target.value)}
            className="type-select"
          >
            <option value="checkbox">Simple Checkbox</option>
            <option value="checkbox-with-tags">Checkbox with Tags</option>
            <option value="numerical">Numerical Habit</option>
          </select>
        </div>
        
        <form onSubmit={handleSubmit} className="habit-form">
          {/* Habit Name - Always shown */}
          <div className="form-group">
            <label htmlFor="habit-name">Habit Name</label>
            <input
              id="habit-name"
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="form-input"
              autoFocus
            />
          </div>

          {/* Tags - Only for checkbox-with-tags */}
          {habitType === "checkbox-with-tags" && (
            <div className="form-group">
              <label>Available Tags</label>
              <div className="tags-container">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="form-hint">Select which tags can be used with this habit</p>
            </div>
          )}

          {/* Daily Requirement - Only for numerical */}
          {habitType === "numerical" && (
            <div className="form-group">
              <label htmlFor="daily-requirement">Daily Requirement</label>
              <input
                id="daily-requirement"
                type="number"
                value={dailyRequirement}
                onChange={(e) => setDailyRequirement(e.target.value)}
                placeholder="e.g., 8 glasses, 10000 steps"
                className="form-input"
                min="0"
              />
              <p className="form-hint">How many times or how much per day?</p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-create">
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}