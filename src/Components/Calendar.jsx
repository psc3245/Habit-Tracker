import { useState, useEffect } from "react";
import "../Style/Calendar.css";

export default function Calendar({
  selectedDate,
  onDateSelect,
  isOpen,
  onClose,
}) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    setCurrentDate(selectedDate || new Date());
    setCurrentMonth((selectedDate || new Date()).getMonth());
    setCurrentYear((selectedDate || new Date()).getFullYear());
  }, [selectedDate]);

  return (
    <div>
      {isOpen && (
        <div className="calendar-modal">
          <div className="calendar-nav-bar">
            <button className="calendar-left-arrow"> {"<"} </button>
            <button
              className="calendar-month-year-button"
              onClick={() => {
                /* We'll add functionality later */
              }}
            >
              {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
                month: "long",
              })}{" "}
              {currentYear}
            </button>
            <button className="calendar-right-arrow"> {">"} </button>
          </div>
          <div className="calendar-grid">
            <p>S</p>
            <p>M</p>
            <p>T</p>
            <p>W</p>
            <p>T</p>
            <p>F</p>
            <p>S</p>
            {Array.from({ length: 30 }, (_, i) => (
              <button key={i} className="calendar-date-button">
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
