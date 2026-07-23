import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../Style/CreateHabitModal.css";
import CustomRecurrenceModal from "./CustomRecurrenceModal.jsx";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import { HABIT_TYPE_LABELS } from "../Helpers/HabitHelper.js";

const TYPE_HINTS = {
  checkbox: "A simple done / not-done habit.",
  counter: "Track a daily count against a goal (e.g. glasses of water).",
  duration: "Track minutes spent against a daily goal.",
  slider: "Log a numeric value on a custom scale each day.",
  rating: "Rate your day 1-5 with an emoji scale.",
  checknote: "Check it off, with an optional note.",
  shorttext: "A one-line entry each day (e.g. gratitude, highlight).",
  journal: "A longer freeform journal entry each day.",
};

const HABIT_TEMPLATES = [
  { name: "Drink Water", type: "counter", target: "8" },
  { name: "Exercise", type: "checkbox" },
  { name: "Read", type: "duration", target: "20" },
  { name: "Meditate", type: "checkbox" },
  { name: "Sleep 8h", type: "checkbox" },
  { name: "Mood Check-in", type: "rating" },
  { name: "Gratitude", type: "shorttext" },
  { name: "Journal", type: "journal" },
];

export default function CreateEditHabitModal({
  user,
  isOpen,
  onClose,
  onCreateHabit,
  onUpdateHabit,
  setHabits,
  selectedDate,
  habitInfo,
  handleDeleteHabit,
  defaultHabitType,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [habitId, setHabitId] = useState("");
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("checkbox");
  const [hasTags, setHasTags] = useState(false);
  const [customTags, setCustomTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [target, setTarget] = useState("");
  const [selectedRecurrence, setSelectedRecurrence] = useState("daily");
  const [interval, setInterval] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [toggleCustomRecurrence, setToggleCustomRecurrence] = useState(false);
  const [sliderMin, setSliderMin] = useState("1");
  const [sliderMax, setSliderMax] = useState("10");
  const [colorLow, setColorLow] = useState("#ff6b6b");
  const [colorMid, setColorMid] = useState("#ffd966");
  const [colorHigh, setColorHigh] = useState("#51cf66");
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    if (!isEditing) setHabitType(defaultHabitType);
  }, [isEditing]);

  useEffect(() => {
    if (!habitInfo) return;

    setIsEditing(true);
    setHabitId(habitInfo.id);
    setHabitName(habitInfo.name);
    setHabitType(habitInfo.habitType);
    setHasTags(habitInfo.hasTags);
    setCustomTags(habitInfo.availableTags);
    setArchived(habitInfo.archived ?? false);
    setInterval(habitInfo.recurrence.interval);
    setRecurrenceDays(habitInfo.recurrence.days);
    if (habitInfo.recurrence.interval === 1) {
      if (habitInfo.recurrence.days.length === 1) {
        setSelectedRecurrence("weekly");
      } else if (habitInfo.recurrence.days.length === 7) {
        setSelectedRecurrence("daily");
      } else setSelectedRecurrence("custom");
    } else {
      setSelectedRecurrence("custom");
    }
    if (habitInfo.habitType !== "checkbox") {
      setTarget(habitInfo.target);
      if (habitInfo.habitType === "slider") {
        setSliderMin(habitInfo.sliderMin);
        setSliderMax(habitInfo.sliderMax);
        setColorLow(habitInfo.colorLow);
        setColorMid(habitInfo.colorMid);
        setColorHigh(habitInfo.colorHigh);
      }
    }
  }, [habitInfo]);

  const colorOptions = [
    { value: "#ff6b6b", label: "Red" },
    { value: "#ff9f43", label: "Orange" },
    { value: "#ffd966", label: "Yellow" },
    { value: "#51cf66", label: "Green" },
    { value: "#a29bfe", label: "Purple" },
    { value: "#74b9ff", label: "Blue" },
  ];

  useEffect(() => {
    if (isOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    console.log(`created at: ${selectedDate}`);
    const habitData = {
      userId: user.id,
      name: habitName.trim(),
      type: habitType,
      recurrence: {
        interval: interval,
        days: recurrenceDays,
      },
      createdAt: selectedDate,
      target:
        habitType === "slider"
          ? parseInt(sliderMax)
          : habitType === "rating"
            ? 5
            : parseInt(target) || 1,
      availableTags: hasTags ? customTags : [],
      sliderMin:
        habitType === "slider"
          ? parseInt(sliderMin)
          : habitType === "rating"
            ? 1
            : undefined,
      colorLow: habitType === "slider" ? colorLow : undefined,
      colorMid: habitType === "slider" ? colorMid : undefined,
      colorHigh: habitType === "slider" ? colorHigh : undefined,
      archived: isEditing ? archived : undefined,
    };

    try {
      if (!isEditing) {
        const newHabit = await onCreateHabit(habitData);

        if (!newHabit) {
          console.error("onCreateHabit returned null/undefined!");
          alert("Failed to create habit - check console for details");
          return;
        }

        setHabits((prev) => [...prev, HabitHelper.mapHabit(newHabit)]);
      }

      if (isEditing) {
        const updatedHabit = await onUpdateHabit(habitData, habitId);

        if (!updatedHabit) {
          console.error("onUpdateHabit returned null/undefined!");
          alert("Failed to update habit - check console for details");
          return;
        }

        setHabits((prev) =>
          prev.map((h) =>
            h.id === updatedHabit.habit_id
              ? HabitHelper.mapHabit(updatedHabit)
              : h,
          ),
        );
      }

      onClose();
    } catch (err) {
      console.error("Failed to create habit:", err);
      alert("Error: " + err.message);
    }
  };

  const handleCancel = () => {
    setHabitName("");
    setHabitType("checkbox");
    setHasTags(false);
    setCustomTags([]);
    setNewTagInput("");
    setTarget("");
    setSelectedRecurrence("daily");
    setInterval(1);
    setRecurrenceDays([0, 1, 2, 3, 4, 5, 6]);
    setIsEditing(false);
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

  const applyTemplate = (template) => {
    setHabitName(template.name);
    setHabitType(template.type);
    setTarget(template.target || "");
  };

  const handleToggleArchive = async () => {
    const nextArchived = !archived;
    const habitData = {
      userId: user.id,
      name: habitName.trim(),
      type: habitType,
      recurrence: { interval, days: recurrenceDays },
      target:
        habitType === "slider"
          ? parseInt(sliderMax)
          : habitType === "rating"
            ? 5
            : parseInt(target) || 1,
      availableTags: hasTags ? customTags : [],
      sliderMin:
        habitType === "slider"
          ? parseInt(sliderMin)
          : habitType === "rating"
            ? 1
            : undefined,
      colorLow: habitType === "slider" ? colorLow : undefined,
      colorMid: habitType === "slider" ? colorMid : undefined,
      colorHigh: habitType === "slider" ? colorHigh : undefined,
      archived: nextArchived,
    };

    try {
      const updatedHabit = await onUpdateHabit(habitData, habitId);
      if (!updatedHabit) return;
      setArchived(nextArchived);
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? { ...HabitHelper.mapHabit(updatedHabit), archived: nextArchived }
            : h,
        ),
      );
      onClose();
    } catch (err) {
      console.error("Failed to update archive state:", err);
      alert("Error: " + err.message);
    }
  };

  return createPortal(
    <>
      {toggleCustomRecurrence && (
        <CustomRecurrenceModal
          habitName={habitName}
          interval={interval}
          setInterval={setInterval}
          recurrenceDays={recurrenceDays}
          setRecurrenceDays={setRecurrenceDays}
          handleCancel={() => {
            setToggleCustomRecurrence(false);
          }}
          handleSubmit={(inter, days) => {
            setToggleCustomRecurrence(false);
          }}
        />
      )}
      <div className="modal-overlay" onClick={handleCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">
              {isEditing ? "Edit Habit" : "Create New Habit"}
            </h2>
            <div className="header-controls">
              <select
                value={habitType}
                onChange={(e) => setHabitType(e.target.value)}
                className="type-select"
              >
                {Object.entries(HABIT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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

          {!isEditing && (
            <div className="template-gallery">
              <p className="form-hint template-gallery-label">
                Quick add:
              </p>
              <div className="template-gallery-items">
                {HABIT_TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    className="template-chip"
                    onClick={() => applyTemplate(template)}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <p className="form-hint">{TYPE_HINTS[habitType]}</p>
            </div>

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

            {(habitType === "counter" || habitType === "duration") && (
              <div className="form-group">
                <label htmlFor="daily-requirement">
                  {habitType === "counter" && "Daily Goal"}
                  {habitType === "duration" && "Goal (minutes)"}
                </label>
                <input
                  id="daily-requirement"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
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
              </div>
            )}

            {habitType === "slider" && (
              <>
                <div className="form-group">
                  <label>Rating Range</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="slider-min"
                        style={{ fontSize: "12px", color: "#666" }}
                      >
                        Min
                      </label>
                      <input
                        id="slider-min"
                        type="number"
                        value={sliderMin}
                        onChange={(e) => setSliderMin(e.target.value)}
                        onBlur={(e) => {
                          const newMin = parseInt(e.target.value);
                          const currentMax = parseInt(sliderMax);
                          if (newMin >= currentMax)
                            setSliderMin((currentMax - 1).toString());
                        }}
                        className="form-input"
                        min="1"
                        max="99"
                      />
                    </div>
                    <span style={{ paddingTop: "20px" }}>to</span>
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="slider-max"
                        style={{ fontSize: "12px", color: "#666" }}
                      >
                        Max
                      </label>
                      <input
                        id="slider-max"
                        type="number"
                        value={sliderMax}
                        onChange={(e) => setSliderMax(e.target.value)}
                        onBlur={(e) => {
                          const newMax = parseInt(e.target.value);
                          const currentMin = parseInt(sliderMin);
                          if (newMax <= currentMin)
                            setSliderMax((currentMin + 1).toString());
                        }}
                        className="form-input"
                        min="2"
                        max="100"
                      />
                    </div>
                  </div>
                  <p className="form-hint">
                    Set the minimum (1-99) and maximum (2-100) values for your
                    rating scale
                  </p>
                </div>

                <div className="form-group">
                  <label>Gradient Colors</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <select
                      id="color-low"
                      value={colorLow}
                      onChange={(e) => setColorLow(e.target.value)}
                      className="type-select"
                    >
                      {colorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <select
                      id="color-mid"
                      value={colorMid}
                      onChange={(e) => setColorMid(e.target.value)}
                      className="type-select"
                    >
                      {colorOptions
                        .filter(
                          (opt) =>
                            opt.value !== colorLow && opt.value !== colorHigh,
                        )
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                    <select
                      id="color-high"
                      value={colorHigh}
                      onChange={(e) => setColorHigh(e.target.value)}
                      className="type-select"
                    >
                      {colorOptions
                        .filter(
                          (opt) =>
                            opt.value !== colorLow && opt.value !== colorMid,
                        )
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <p className="form-hint">
                    Choose colors for low, medium, and high values
                  </p>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="recurrence">Pattern of Recurrence</label>
              <select
                value={selectedRecurrence}
                onChange={(e) => {
                  setSelectedRecurrence(e.target.value);
                  if (e.target.value === "daily") {
                    setInterval(1);
                    setRecurrenceDays([0, 1, 2, 3, 4, 5, 6]);
                  }
                  if (e.target.value === "weekly") {
                    setInterval(1);
                    setRecurrenceDays([selectedDate.getDay()]);
                  }
                  if (e.target.value === "custom") {
                    setToggleCustomRecurrence(true);
                  }
                }}
                className="type-select"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
              <p className="form-hint">
                How often will this habit be completed?
              </p>
              <div className="modal-actions">
                {selectedRecurrence === "custom" && (
                  <div className="custom-schedule-preview">
                    <button
                      type="button"
                      onClick={() => setToggleCustomRecurrence(true)}
                      className="btn-edit"
                    >
                      <span className="btn-edit-label">
                        Current Schedule ✏️
                      </span>
                    </button>
                    <div className="custom-schedule-details">
                      <p className="form-hint">
                        Recurring every{" "}
                        {interval === 1 ? "week " : `${interval} weeks `}
                        on the following{" "}
                        {recurrenceDays.length === 1 ? "day" : "days"}
                      </p>
                      <div className="custom-schedule-days">
                        {recurrenceDays.map((day) => (
                          <p key={day} className="schedule-day">
                            {
                              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                                day
                              ]
                            }
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="btn-create">
                {isEditing ? "Save Changes" : "Create Habit"}
              </button>
            </div>
            {isEditing && (
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleToggleArchive}
                  className="btn-archive"
                >
                  {archived ? "Unarchive Habit" : "Archive Habit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteHabit(habitId);
                    setHabits(prev => prev.filter(h => h.id !== habitId));
                    onClose();
                  }}
                  className="btn-delete"
                >
                  Delete Habit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>,
    document.body,
  );
}
