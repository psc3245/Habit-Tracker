import { useState, useEffect } from "react";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import "../Style/Stats.css";

const PLACEHOLDER_STATS = [
  {
    habit: { id: "p1", name: "Morning Routine" },
    completionStats: [18, 23],
    streakStats: {
      currentStreak: 3,
      currentStreakStart: new Date("2026-03-20"),
      longestStreak: 7,
      longestStreakStart: new Date("2026-02-01"),
      longestStreakEnd: new Date("2026-02-07"),
    },
  },
  {
    habit: { id: "p2", name: "Exercise" },
    completionStats: [12, 20],
    streakStats: {
      currentStreak: 0,
      currentStreakStart: null,
      longestStreak: 5,
      longestStreakStart: new Date("2026-01-10"),
      longestStreakEnd: new Date("2026-01-14"),
    },
  },
  {
    habit: { id: "p3", name: "Reading" },
    completionStats: [21, 23],
    streakStats: {
      currentStreak: 5,
      currentStreakStart: new Date("2026-03-18"),
      longestStreak: 10,
      longestStreakStart: new Date("2026-02-10"),
      longestStreakEnd: new Date("2026-02-19"),
    },
  },
];

export default function Stats({ user }) {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [completionStats, setCompletionStats] = useState([]);
  const [expandedHabits, setExpandedHabits] = useState(new Set());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const getCompletions = async () => {
      if (!user) return;
      const result = await CompletionHelper.getCompletionsByUserId(user.id);
      setCompletions(result);
    };

    const getHabits = async () => {
      if (!user) return;
      const result = await HabitHelper.getHabitsByUserId(user.id);
      setHabits(result.map(HabitHelper.mapHabit));
    };

    getCompletions();
    getHabits();
  }, [user]);

  useEffect(() => {
    setCompletionStats(getAllCompletionStats());
  }, [habits]);

  const getExpectedCompletions = (habit, startDate) => {
    let expected = 0;
    const curr = new Date(startDate);
    while (curr <= today) {
      if (habit.recurrence.days.includes(curr.getDay())) {
        expected++;
      }
      curr.setDate(curr.getDate() + 1);
    }
    return expected;
  };

  const findStreaks = (habit) => {
    const completionDates = new Set(
      completions.filter((c) => c.habit_id === habit.id).map((c) => c.date),
    );
    const parts = habit.createdAt.split("T")[0].split("-");
    const curr = new Date(parts[0], parts[1] - 1, parts[2]);
    let streak = 0;
    let longestStreak = 0;
    let longestStreakStart = null;
    let longestStreakEnd = null;
    let streakStart = null;
    let streakEnd = null;
    while (curr <= today) {
      if (
        habit.recurrence.days.includes(curr.getDay()) &&
        completionDates.has(formatDate(curr)) &&
        streak > 0
      ) {
        streak += 1;
        streakEnd = new Date(curr);
      } else if (
        habit.recurrence.days.includes(curr.getDay()) &&
        !completionDates.has(formatDate(curr)) &&
        streak > 0
      ) {
        streak = 0;
        streakEnd = new Date(curr);
        streakStart = null;
      } else if (
        habit.recurrence.days.includes(curr.getDay()) &&
        completionDates.has(formatDate(curr)) &&
        streak === 0
      ) {
        streakStart = new Date(curr);
        streakEnd = new Date(curr);
        streak += 1;
      }
      if (longestStreak <= streak) {
        longestStreak = streak;
        longestStreakStart = streakStart;
        longestStreakEnd = streakEnd;
      }
      curr.setDate(curr.getDate() + 1);
    }
    return {
      currentStreak: streak,
      currentStreakStart: streakStart,
      longestStreak: longestStreak,
      longestStreakStart: longestStreakStart,
      longestStreakEnd: longestStreakEnd,
    };
  };

  const getCompletionStats = (habit) => {
    const expectedCompletions = getExpectedCompletions(habit, habit.createdAt);
    const totalCompletions = completions.filter(
      (c) => c.habit_id === habit.id,
    ).length;
    return [totalCompletions, expectedCompletions];
  };

  const getAllCompletionStats = () => {
    const stats = {};
    habits.map((habit) => {
      stats[habit.name] = {
        habit: habit,
        completionStats: getCompletionStats(habit),
        streakStats: findStreaks(habit),
      };
    });
    return stats;
  };

  const toggleHabit = (id) => {
    setExpandedHabits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderStatCard = (stat, placeholder = false) => (
    <div
      key={stat.habit.id}
      className={`stats-habit-card${placeholder ? " stats-habit-card--placeholder" : ""}`}
    >
      <div className="stats-card-header">
        <span className="stats-habit-name">{stat.habit.name}</span>
        <button
          className="stat-card-toggle-btn"
          onClick={() => toggleHabit(stat.habit.id)}
        >
          {expandedHabits.has(stat.habit.id) ? "▲" : "▼"}
        </button>
      </div>
      {expandedHabits.has(stat.habit.id) && (
        <div className="stat-detail-card-expanded">
          <div className="stats-detail-row">
            <span className="stats-detail">
              {stat.completionStats[0]} completed
            </span>
            <span className="stats-divider">|</span>
            <span className="stats-detail">
              {stat.completionStats[1] > 0
                ? (
                    100.0 *
                    (stat.completionStats[0] / stat.completionStats[1])
                  ).toFixed(1)
                : 0}
              % completion rate
            </span>
          </div>
          <div className="stats-detail-row">
            <span className="stats-detail">
              Longest streak: {stat.streakStats.longestStreak} days
            </span>
            <span className="stats-divider">|</span>
            <span className="stats-detail">
              {stat.streakStats.longestStreakStart?.toLocaleDateString()} –{" "}
              {stat.streakStats.longestStreakEnd?.toLocaleDateString()}
            </span>
          </div>
          {stat.streakStats.currentStreak !== 0 ? (
            <div className="stats-streak">
              <span className="stats-detail">
                Current streak: {stat.streakStats.currentStreak} days
              </span>
              <span className="stats-detail">
                Since:{" "}
                {stat.streakStats.currentStreakStart?.toLocaleDateString()}
              </span>
            </div>
          ) : (
            <span className="stats-detail">Not currently on a streak</span>
          )}
        </div>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="stats-page">
        <h2 className="stats-title">Statistics</h2>
        <p className="stats-no-user">Log in to see your habit statistics.</p>
        <div className="stats-list">
          {PLACEHOLDER_STATS.map((stat) => renderStatCard(stat, false))}
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <h2 className="stats-title">{user.first_name}'s Statistics</h2>
      <div className="stats-list">
        {Object.values(completionStats).map((stat) => renderStatCard(stat, false))}
      </div>
    </div>
  );
}