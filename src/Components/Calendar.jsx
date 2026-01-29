import { useState, useEffect } from "react";

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
          <h3>Calendar</h3>
          <div className="calendar-nav-bar">
            <button className="calendar-left-arrow"> {"<"} </button>
            <h2>
              {currentMonth}, {currentYear}
            </h2>
            <button className="calendar-right-arrow"> {">"} </button>
            <button className="calendar-close-button" onClick={onClose}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
