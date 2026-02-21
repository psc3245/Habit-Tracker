import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../Style/CustomRecurrenceModal.css"

export default function CustomRecurrence({
  habitName,
  interval,
  setInterval,
  recurrenceDays,
  setRecurrenceDays,
  handleCancel,
  handleSubmit,
}) {
  const toggleDay = (day) => {
    if (recurrenceDays.includes(day)) {
      setRecurrenceDays(recurrenceDays.filter((d) => d !== day));
    } else {
      setRecurrenceDays([...recurrenceDays, day].sort((a, b) => a - b));
    }
  };

  return createPortal(
    <div className="custom-recurrence-overlay" onClick={handleCancel}>
      <div className="custom-recurrence-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Custom Schedule for {habitName} </h2>
        </div>
        <form onSubmit={handleSubmit} className="custom-recurrence-form">
          <div className="form-group">
            <label htmlFor="interval">
              How frequently should this habit repeat? (every _ weeks)
            </label>
            <input
              id="interval"
              type="number"
              value={interval}
              onChange={(e) => setInterval(Math.max(1, e.target.value) || 1)}
              placeholder="1"
              className="form-input"
              autoFocus
            />
            <div className="form-group">
              <div className="day-btns">
                {[
                  ["S", 0],
                  ["M", 1],
                  ["T", 2],
                  ["W", 3],
                  ["T", 4],
                  ["F", 5],
                  ["S", 6],
                ].map(([label, day]) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-btn ${recurrenceDays.includes(day) ? "active" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
                Submit Recurrence
              </button>
            </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
