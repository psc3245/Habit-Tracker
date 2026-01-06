import { useState } from "react";
import DailyHabit from "./DailyHabit";

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
    <>
      <div className="page left">
        <h2>Habits</h2>
        {habits.map((habit, i) => (
          <DailyHabit
            key={habit.name}
            habit={habit.name}
            completed={habit.completed}
            onToggle={() => toggleHabit(i)}
          />
        ))}
      </div>

      <div className="spine" />

      <div className="page right">
        <h2>Today</h2>
        {habits.map((habit, i) => (
          <DailyHabit
            key={habit.name}
            habit={habit.name}
            completed={habit.completed}
            onToggle={() => toggleHabit(i)}
          />
        ))}
      </div>
    </>
  );
}
