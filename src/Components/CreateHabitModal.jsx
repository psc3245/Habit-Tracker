import { useState } from "react";
import "../Style/CreateHabitModal.css";

export default function CreateHabitModal({ isOpen, onClose, onCreateHabit }) {
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("checkbox");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onCreateHabit({
        name: habitName.trim(),
        type: habitType
      });
      // Reset form
      setHabitName("");
      setHabitType("checkbox");
      onClose();
    }
  };

  const handleCancel = () => {
    setHabitName("");
    setHabitType("checkbox");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Create New Habit</h2>
        
        <form onSubmit={handleSubmit} className="habit-form">
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

          <div className="form-group">
            <label htmlFor="habit-type">Habit Type</label>
            <select
              id="habit-type"
              value={habitType}
              onChange={(e) => setHabitType(e.target.value)}
              className="form-select"
            >
              <option value="checkbox">Simple Checkbox</option>
              <option value="checkbox-with-tags">Checkbox with Tags</option>
            </select>
          </div>

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