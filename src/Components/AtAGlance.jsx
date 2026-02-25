import { useState, useEffect } from "react";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import * as HabitHelper from "../Helpers/HabitHelper.js";

export default function AtAGlance({ user, selectedDate, setSelectedDate }) {
  const [timeframe, setTimeframe] = useState("weekly");
  const [completions, setCompletions] = useState([]);
  const [habits, setHabits] = useState([]);

  const getWeekDateRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return [startOfWeek, endOfWeek];
  };

  const getMonthDateRange = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return [startOfMonth, endOfMonth];
  };

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
  }, [user, timeframe, selectedDate]);

  const dailyHabits = habits.filter(
    (h) => h.recurrence?.interval === 1 && h.recurrence.days.length === 7,
  );
  const weeklyHabits = habits.filter(
    (h) => h.recurrence?.interval === 1 && h.recurrence.days.length === 1,
  );
  const otherHabits = habits.filter(
    (h) => !dailyHabits.includes(h) && !weeklyHabits.includes(h),
  );

  const getHabitSummary = (habit, startDate, endDate) => {
    const habitCompletions = completions.filter((c) => c.habitId === habit.id);
    if (habit.type === "checkbox") {
      return {
        completionRatio: [
          habitCompletions.length,
          getExpectedCompletions(habit, startDate, endDate),
        ],
      };
    } else {
      return {
        avgToTargetRatio: getAverageHabitSummary(habit, habitCompletions),
        completionRatio: getCompletionRatio(
          habit,
          habitCompletions,
          startDate,
          endDate,
        ),
      };
    }
  };

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

  const getAverageHabitSummary = (habit, completions) => {
    if (completions.length === 0) return [0, habit.target];
    const avgCompletion =
      completions.reduce((accumulator, completion) => {
        return (accumulator += completion.value);
      }, 0) / completions.length;
    return [avgCompletion, habit.target];
  };

  const getCompletionRatio = (habit, completions, startDate, endDate) => {
    const expected = getExpectedCompletions(habit, startDate, endDate);
    const numCompletions = completions.reduce((accumulator, completion) => {
      if (habit.type != "slider")
        return completion.value >= habit.target ? accumulator + 1 : accumulator;
      else 
        return completion.value != null ? accumulator + 1 : accumulator;
    }, 0);
    return [numCompletions, expected];
  };

  return (
    <>
      {user ? (
        <>
          <div>
            <h2>At A Glance Page for {user.username}</h2>
            <select
              name="timeframe"
              id="timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <h2>Daily Habits</h2>
            {dailyHabits.map((h) => {
              return (
                <div>
                  <h4>{h.name}</h4>
                  <p>{h.type}</p>
                  <div>
                    <p>
                      {completions.filter((c) => c.habitId === h.id).length} / 7
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div>
          <p>No user id, default page</p>
        </div>
      )}
    </>
  );
}
