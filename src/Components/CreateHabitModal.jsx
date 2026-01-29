import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../Style/CreateHabitModal.css";

export default function CreateHabitModal({
  user,
  isOpen,
  onClose,
  onCreateHabit,
  setHabits,
}) {
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("checkbox");
  const [hasTags, setHasTags] = useState(false);
  const [customTags, setCustomTags] = useState([]); // Custom tags for this habit
  const [newTagInput, setNewTagInput] = useState(""); // Input for new tag
  const [dailyRequirement, setDailyRequirement] = useState("");
  const [recurrence, setRecurrence] = useState("daily");

  useEffect(() => {
    if (isOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    const habitData = {
      userId: user.id,
      name: habitName.trim(),
      type: habitType,
      schedule: recurrence,
      target: parseInt(dailyRequirement) || 1,
      availableTags: hasTags ? customTags : [],
    };

    try {
      const newHabit = await onCreateHabit(habitData);
      console.log("Created habit:", newHabit);

      if (newHabit && setHabits) {
        setHabits((prev) => [
          ...prev,
          {
            id: newHabit.id,
            name: newHabit.name,
            type: newHabit.type,
            completed: false,
            hasTags: (newHabit.availableTags ?? []).length > 0,
            availableTags: newHabit.availableTags ?? [],
            selectedTag: null, // Will be set when user completes the habit
          },
        ]);
      }

      // Reset form
      setHabitName("");
      setHabitType("checkbox");
      setHasTags(false);
      setCustomTags([]);
      setNewTagInput("");
      setDailyRequirement("");
      setRecurrence("daily");
      onClose();
    } catch (err) {
      console.error("Failed to create habit:", err.message);
    }
  };

  const handleCancel = () => {
    setHabitName("");
    setHabitType("checkbox");
    setHasTags(false);
    setCustomTags([]);
    setNewTagInput("");
    setDailyRequirement("");
    setRecurrence("daily");
    onClose();
  };

  const addTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !customTags.includes(trimmed)) {
      setCustomTags((prev) => [...prev, trimmed]);
      setNewTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setCustomTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Create New Habit</h2>
          <div className="header-controls">
            <select
              value={habitType}
              onChange={(e) => setHabitType(e.target.value)}
              className="type-select"
            >
              <option value="checkbox">Checkbox</option>
              <option value="counter">Counter</option>
              <option value="duration">Duration</option>
              <option value="scale">Scale (1-10)</option>
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasTags}
                onChange={(e) => setHasTags(e.target.checked)}
                className="form-checkbox"
              />
              Has Tags
            </label>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="habit-form">
          {/* Habit Name */}
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

          {/* Custom Tags */}
          {hasTags && (
            <div className="form-group">
              <label>Custom Tags for this Habit</label>
              <div className="tags-list">
                {customTags.map((tag) => (
                  <div key={tag} className="tag-item">
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="remove-tag-btn"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="add-tag-container">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tag..."
                    className="tag-input"
                  />
                  <button
                    type="button"
                    className="add-tag-btn"
                    onClick={addTag}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="form-hint">
                Add custom tags for this habit (e.g., easy/medium/hard)
              </p>
            </div>
          )}

          {/* Daily Requirement */}
          {(habitType === "counter" ||
            habitType === "duration" ||
            habitType === "scale") && (
            <div className="form-group">
              <label htmlFor="daily-requirement">
                {habitType === "counter" && "Daily Goal"}
                {habitType === "duration" && "Goal (minutes)"}
                {habitType === "scale" && "Not applicable for scale"}
              </label>
              {habitType !== "scale" ? (
                <>
                  <input
                    id="daily-requirement"
                    type="number"
                    value={dailyRequirement}
                    onChange={(e) => setDailyRequirement(e.target.value)}
                    placeholder={
                      habitType === "counter"
                        ? "e.g., 8 glasses, 10000 steps"
                        : "e.g., 20 minutes"
                    }
                    className="form-input"
                    min="0"
                  />
                  <p className="form-hint">
                    {habitType === "counter" && "How many times per day?"}
                    {habitType === "duration" && "How many minutes per day?"}
                  </p>
                </>
              ) : (
                <p className="form-hint">
                  Scale habits use a 1-10 slider, no goal needed
                </p>
              )}
            </div>
          )}

          {/* Recurrence */}
          <div className="form-group">
            <label htmlFor="recurrence">Pattern of Recurrence</label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="type-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <p className="form-hint">How often will this habit be completed?</p>
          </div>

          {/* Actions */}
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
    </div>,
    document.body,
  );
}