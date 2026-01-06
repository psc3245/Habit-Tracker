import { useState } from "react";
import DailyHabit from "./DailyHabit";
import "../Style/DailyPage.css";

export default function DailyPage() {
  const initialHabits = ["Drink water", "Exercise", "Read", "Meditate", "Sleep 8h"];

  const [habits, setHabits] = useState(
    initialHabits.map((h) => ({ name: h, completed: false }))
  );

  const toggleHabit = (index) => {
    setHabits((prev) =>
      prev.map((h, i) =>
        i === index ? { ...h, completed: !h.completed } : h
      )
    );
  };

  return (
    <div className="daily-page">
      <h2 className="daily-title">Daily Habits</h2>
      <button className="new-habit-btn">+ New Habit</button>
      {habits.map((habit, i) => (
        <DailyHabit
          key={habit.name}
          habit={habit.name}
          completed={habit.completed}
          onToggle={() => toggleHabit(i)}
        />
      ))}
    </div>
  );
}