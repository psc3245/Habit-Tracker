import "../Style/DailyHabit.css";
import { useState } from "react";

export default function DailyHabit({ habit, completed, onToggle }) {
  return (
    <div className="daily-habit">
      <span className="habit-name">{habit}</span>
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="habit-checkbox"
      />
    </div>
  );
}
