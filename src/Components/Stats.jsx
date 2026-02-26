import { useState, useEffect } from "react";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";

export default function Stats({ user }) {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const today = new Date().setHours(0, 0, 0, 0);

  useEffect(() => {
    const getCompletions = async () => {
      if (!user) return;
      let dates;
      if (timeframe === "weekly") dates = getWeekDateRange(selectedDate);
      else dates = getMonthDateRange(selectedDate);

      const result = await CompletionHelper.getCompletionsByUserIdAndDateRange(
        user.id,
        dates[0],
        dates[1],
      );
      setCompletions(result);
    };

    const getHabits = async () => {
      if (!user) return;
      const result = await HabitHelper.getHabitsByUserId(user.id);
      setHabits(result);
    };

    getCompletions();
    getHabits();
  }, [user]);

  const getExpectedCompletions = (habit, startDate, endDate) => {
    let expected = 0;
    const curr = new Date(startDate);
    while (curr <= endDate) {
      if (habit.recurrence.days.includes(curr.getDay())) {
        expected++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    return expected;
  };

  const getCompletionStats = (habit) => {
    const expectedCompletions = getExpectedCompletions(habit, habit.createdAt, today);
  }

  return (
    <div>
      {user ? (
        <div>
          <h2> {user.username}'s habit statistics</h2>
        </div>
      ) : (
        <div>
          <p> Log in to see your stats! </p>
        </div>
      )}
    </div>
  );
}
