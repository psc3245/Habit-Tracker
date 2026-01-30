import { useState, useEffect } from "react";
import "../Style/Calendar.css";

export default function Calendar({
  selectedDate,
  onDateSelect,
  isOpen,
  onClose,
}) {
  const initialDate = selectedDate || new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    if (isOpen) {
      const dateToShow = selectedDate || new Date();
      setCurrentMonth(dateToShow.getMonth());
      setCurrentYear(dateToShow.getFullYear());
    }
  }, [isOpen]);

  const decrementMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const incrementMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderDates = () => {
    let daysInMonth = 30;
    const monthsWith31Days = [0, 2, 4, 6, 7, 9, 11];

    if (monthsWith31Days.includes(currentMonth)) {
      daysInMonth = 31;
    } else if (currentMonth === 1) {
      const isLeapYear =
        (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
        currentYear % 400 === 0;
      daysInMonth = isLeapYear ? 29 : 28;
    }

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    return Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) => {
      if (i < firstDayOfMonth) {
        return (
          <button
            key={`empty-${i}`}
            className="calendar-date-button empty"
            disabled
          ></button>
        );
      } else {
        const day = i - firstDayOfMonth + 1;
        return (
          <button
            key={day}
            className="calendar-date-button"
            onClick={() =>
              onDateSelect(new Date(currentYear, currentMonth, day))
            }
          >
            {day}
          </button>
        );
      }
    });
  };

  return (
    <div>
      {isOpen && (
        <div className="calendar-modal">
          <div className="calendar-nav-bar">
            <button className="calendar-left-arrow" onClick={decrementMonth}>
              {"<"}
            </button>
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
            <button className="calendar-right-arrow" onClick={incrementMonth}>
              {">"}
            </button>
          </div>
          <div className="calendar-grid">
            <p>S</p>
            <p>M</p>
            <p>T</p>
            <p>W</p>
            <p>T</p>
            <p>F</p>
            <p>S</p>
            {renderDates()}
          </div>
        </div>
      )}
    </div>
  );
}