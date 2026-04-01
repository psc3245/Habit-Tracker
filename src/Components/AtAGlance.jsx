import { useState, useEffect } from "react";
import "../Style/AtAGlance.css";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import * as HabitHelper from "../Helpers/HabitHelper.js";

const today = new Date();
today.setHours(0, 0, 0, 0);

const PLACEHOLDER_HABITS = {
  daily: [
    {
      habit: { id: "p1", name: "Morning Routine", type: "checkbox" },
      completionRatio: [4, 5],
      remainingCompletions: 2,
    },
    {
      habit: { id: "p2", name: "Drink Water", type: "counter" },
      completionRatio: [3, 5],
      avgToTargetRatio: [6.2, 8],
      remainingCompletions: 2,
    },
  ],
  weekly: [
    {
      habit: { id: "p3", name: "Exercise", type: "checkbox" },
      completionRatio: [2, 3],
      remainingCompletions: 1,
    },
  ],
  other: [
    {
      habit: { id: "p4", name: "Read a Book", type: "checkbox" },
      completionRatio: [1, 2],
      remainingCompletions: 1,
    },
  ],
};

export default function AtAGlance({ user, selectedDate }) {
  const [timeframe, setTimeframe] = useState("weekly");
  const [completions, setCompletions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [expandedHabits, setExpandedHabits] = useState(new Set());

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
      setHabits(result.map(HabitHelper.mapHabit));
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
        return (accumulator += Number(completion.value));
      }, 0) / completions.length;
    return [avgCompletion, habit.target];
  };

  const getCompletionRatio = (habit, completions, startDate, endDate) => {
    const expected = getExpectedCompletions(habit, startDate, endDate);
    const numCompletions = completions.reduce((accumulator, completion) => {
      if (habit.type !== "slider")
        return Number(completion.value) >= habit.target
          ? accumulator + 1
          : accumulator;
      else
        return completion.value != null ? accumulator + 1 : accumulator;
    }, 0);
    return [numCompletions, expected];
  };

  const getHabitSummary = (habit, startDate, endDate) => {
    const habitCompletions = completions.filter((c) => c.habit_id === habit.id);
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

  const toggleHabit = (id) => {
    setExpandedHabits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderHabitRow = (habit, habitSummary, remainingCompletions) => (
    <div key={habit.id} className="glance-habit-row">
      <span className="glance-habit-name">{habit.name}</span>
      <div className="glance-habit-stats">
        <span className="glance-ratio">
          completed {habitSummary.completionRatio[0]} /{" "}
          {habitSummary.completionRatio[1]} times
        </span>
        {habitSummary.avgToTargetRatio && (
          <>
            <span className="glance-stats-divider">|</span>
            <span className="glance-avg">
              avg: {habitSummary.avgToTargetRatio[0]} /{" "}
              {habitSummary.avgToTargetRatio[1]}
            </span>
          </>
        )}
        <span className="glance-stats-divider">|</span>
        <span className="glance-ratio">
          {remainingCompletions} left this{" "}
          {timeframe === "weekly" ? "week" : "month"}
        </span>
        <button
          className="glance-habit-row-btn"
          onClick={() => toggleHabit(habit.id)}
        >
          {expandedHabits.has(habit.id) ? "▼" : "▲"}
        </button>
      </div>
    </div>
  );

  const renderPlaceholderRow = (item) => (
    <div key={item.habit.id} className="glance-habit-row">
      <span className="glance-habit-name">{item.habit.name}</span>
      <div className="glance-habit-stats">
        <span className="glance-ratio">
          completed {item.completionRatio[0]} / {item.completionRatio[1]} times
        </span>
        {item.avgToTargetRatio && (
          <>
            <span className="glance-stats-divider">|</span>
            <span className="glance-avg">
              avg: {item.avgToTargetRatio[0]} / {item.avgToTargetRatio[1]}
            </span>
          </>
        )}
        <span className="glance-stats-divider">|</span>
        <span className="glance-ratio">
          {item.remainingCompletions} left this{" "}
          {timeframe === "weekly" ? "week" : "month"}
        </span>
        <button
          className="glance-habit-row-btn"
          onClick={() => toggleHabit(item.habit.id)}
        >
          {expandedHabits.has(item.habit.id) ? "▼" : "▲"}
        </button>
      </div>
    </div>
  );

  const renderSection = (title, habitList, emptyMessage, placeholder = false, placeholderList = []) => (
    <div className="glance-section">
      <h3 className="glance-section-title">{title}</h3>
      {placeholder ? (
        placeholderList.length === 0 ? (
          <p className="glance-empty">{emptyMessage}</p>
        ) : (
          placeholderList.map((item) => renderPlaceholderRow(item))
        )
      ) : (
        habitList.length === 0 ? (
          <p className="glance-empty">{emptyMessage}</p>
        ) : (
          habitList.map((habit) => {
            const habitSummary = getHabitSummary(habit, startDate, today);
            const remainingCompletions = getExpectedCompletions(habit, today, endDate);
            return renderHabitRow(habit, habitSummary, remainingCompletions);
          })
        )
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="glance-page">
        <div className="glance-header">
          <h2 className="glance-title">At a</h2>
          <select
            className="glance-timeframe-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="weekly">week</option>
            <option value="monthly">month</option>
          </select>
          <h2 className="glance-title">glance:</h2>
        </div>
        <p className="glance-no-user">Log in to see your habits at a glance.</p>
        {renderSection("Daily Habits", [], "No daily habits yet.", true, PLACEHOLDER_HABITS.daily)}
        {renderSection("Weekly Habits", [], "No weekly habits yet.", true, PLACEHOLDER_HABITS.weekly)}
        {renderSection("Other Habits", [], "No other habits yet.", true, PLACEHOLDER_HABITS.other)}
      </div>
    );
  }

  return (
    <div className="glance-page">
      <div className="glance-header">
        <h2 className="glance-title">{user.first_name}'s</h2>
        <select
          className="glance-timeframe-select"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="weekly">week</option>
          <option value="monthly">month</option>
        </select>
        <h2 className="glance-title">at a glance:</h2>
      </div>
      {renderSection("Daily Habits", dailyHabits, "No daily habits yet.")}
      {renderSection("Weekly Habits", weeklyHabits, "No weekly habits yet.")}
      {renderSection("Other Habits", otherHabits, "No other habits yet.")}
    </div>
  );
}