import { useState, useEffect } from "react";
import "../Style/AtAGlance.css";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import * as HabitHelper from "../Helpers/HabitHelper.js";

export default function AtAGlance({ user, selectedDate }) {
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

  const [startDate, endDate] =
    timeframe === "weekly"
      ? getWeekDateRange(selectedDate)
      : getMonthDateRange(selectedDate);
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
      else return completion.value != null ? accumulator + 1 : accumulator;
    }, 0);
    return [numCompletions, expected];
  };

  const [expandedHabits, setExpandedHabits] = useState(new Set());

  const toggleHabit = (id) => {
    setExpandedHabits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="glance-page">
        {user ? (
          <>
            <div className="glance-header">
              <h2 className="glance-title">{user.username}'s</h2>
              <select
                className="glance-timeframe-select"
                name="timeframe"
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="weekly">week</option>
                <option value="monthly">month</option>
              </select>
              <h2 className="glance-title">at a glance: </h2>
            </div>

            <div className="glance-section">
              <h3 className="glance-section-title">Daily Habits</h3>
              {dailyHabits.length === 0 && (
                <p className="glance-empty">No daily habits yet.</p>
              )}
              {dailyHabits.map((habit) => {
                const habitSummary = getHabitSummary(habit, startDate, today);
                const remainingCompletions = getExpectedCompletions(
                  habit,
                  today,
                  endDate,
                );
                return habit.type === "checkbox" ? (
                  <div key={habit.id} className="glance-habit-row">
                    <span className="glance-habit-name">{habit.name}</span>
                    <div className="glance-habit-stats">
                      <span className="glance-ratio">
                        completed {habitSummary["completionRatio"][0]} /{" "}
                        {habitSummary["completionRatio"][1]} times
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-ratio">
                        {remainingCompletions} left this{" "}
                        {timeframe === "weekly" ? "week" : "month"}
                      </span>
                      <button
                        className="glance-habit-row-btn"
                        onClick={() => {
                          toggleHabit(habit.id);
                        }}
                      >
                        {expandedHabits.has(habit.id) ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={habit.id} className="glance-habit-row">
                    <span className="glance-habit-name">{habit.name}</span>
                    <div className="glance-habit-stats">
                      <span className="glance-ratio">
                        completed {habitSummary["completionRatio"][0]} /{" "}
                        {habitSummary["completionRatio"][1]} times
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-avg">
                        avg: {habitSummary["avgToTargetRatio"][0]} /{" "}
                        {habitSummary["avgToTargetRatio"][1]}
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-ratio">
                        {remainingCompletions} left this{" "}
                        {timeframe === "weekly" ? "week" : "month"}
                      </span>
                      <button
                        className="glance-habit-row-btn"
                        onClick={() => {
                          toggleHabit(habit.id);
                        }}
                      >
                        {expandedHabits.has(habit.id) ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glance-section">
              <h3 className="glance-section-title">Weekly Habits</h3>
              {weeklyHabits.length === 0 && (
                <p className="glance-empty">No weekly habits yet.</p>
              )}
              {weeklyHabits.map((habit) => {
                const habitSummary = getHabitSummary(habit, startDate, today);
                const remainingCompletions = getExpectedCompletions(
                  habit,
                  today,
                  endDate,
                );
                return habit.type === "checkbox" ? (
                  <div key={habit.id} className="glance-habit-row">
                    <span className="glance-habit-name">{habit.name}</span>
                    <div className="glance-habit-stats">
                      <span className="glance-ratio">
                        completed {habitSummary["completionRatio"][0]} /{" "}
                        {habitSummary["completionRatio"][1]} times
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-ratio">
                        {remainingCompletions} left this{" "}
                        {timeframe === "weekly" ? "week" : "month"}
                      </span>
                      <button
                        className="glance-habit-row-btn"
                        onClick={() => {
                          toggleHabit(habit.id);
                        }}
                      >
                        {expandedHabits.has(habit.id) ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={habit.id} className="glance-habit-row">
                    <span className="glance-habit-name">{habit.name}</span>
                    <div className="glance-habit-stats">
                      <span className="glance-ratio">
                        completed {habitSummary["completionRatio"][0]} /{" "}
                        {habitSummary["completionRatio"][1]} times
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-avg">
                        avg: {habitSummary["avgToTargetRatio"][0]} /{" "}
                        {habitSummary["avgToTargetRatio"][1]}
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-ratio">
                        {remainingCompletions} left this{" "}
                        {timeframe === "weekly" ? "week" : "month"}
                      </span>
                      <button
                        className="glance-habit-row-btn"
                        onClick={() => {
                          toggleHabit(habit.id);
                        }}
                      >
                        {expandedHabits.has(habit.id) ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glance-section">
              <h3 className="glance-section-title">Other Habits</h3>
              {otherHabits.length === 0 && (
                <p className="glance-empty">No other habits yet.</p>
              )}
              {otherHabits.map((habit) => {
                const habitSummary = getHabitSummary(habit, startDate, today);
                const remainingCompletions = getExpectedCompletions(
                  habit,
                  today,
                  endDate,
                );
                return habit.type === "checkbox" ? (
                  <div key={habit.id} className="glance-habit-row">
                    <span className="glance-habit-name">{habit.name}</span>
                    <div className="glance-habit-stats">
                      <span className="glance-ratio">
                        completed {habitSummary["completionRatio"][0]} /{" "}
                        {habitSummary["completionRatio"][1]} times
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-ratio">
                        {remainingCompletions} left this{" "}
                        {timeframe === "weekly" ? "week" : "month"}
                      </span>
                      <button
                        className="glance-habit-row-btn"
                        onClick={() => {
                          toggleHabit(habit.id);
                        }}
                      >
                        {expandedHabits.has(habit.id) ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={habit.id} className="glance-habit-row">
                    <span className="glance-habit-name">{habit.name}</span>
                    <div className="glance-habit-stats">
                      <span className="glance-ratio">
                        completed {habitSummary["completionRatio"][0]} /{" "}
                        {habitSummary["completionRatio"][1]} times
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-avg">
                        avg: {habitSummary["avgToTargetRatio"][0]} /{" "}
                        {habitSummary["avgToTargetRatio"][1]}
                      </span>
                      <span className="glance-stats-divider">|</span>
                      <span className="glance-ratio">
                        {remainingCompletions} left this{" "}
                        {timeframe === "weekly" ? "week" : "month"}
                      </span>
                      <button
                        className="glance-habit-row-btn"
                        onClick={() => {
                          toggleHabit(habit.id);
                        }}
                      >
                        {expandedHabits.has(habit.id) ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <p className="glance-no-user">
              Log in to see your habits at a glance.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
