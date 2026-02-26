import { useState, useEffect } from "react";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import "../Style/Stats.css";

export default function Stats({ user }) {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [completionStats, setCompletionStats] = useState([]);
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
      setHabits(result);
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
      completions.filter((c) => c.habitId === habit.id).map((c) => c.date),
    );
    const curr = new Date(habit.createdAt);
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
        // we should complete it today, we did complete it today, and we are on a streak
        // = continue streak
        streak += 1;
        streakEnd = new Date(curr);
      } else if (
        habit.recurrence.days.includes(curr.getDay()) &&
        !completionDates.has(formatDate(curr)) &&
        streak > 0
      ) {
        // we should complete it today, we did not complete it today, and we are on a streak
        // = end streak
        streak = 0;
        streakEnd = new Date(curr);
        streakStart = null;
      } else if (
        habit.recurrence.days.includes(curr.getDay()) &&
        completionDates.has(formatDate(curr)) &&
        streak === 0
      ) {
        // we should complete it today, we did complete it today, but we are not on a streak
        // = start a new one
        streakStart = new Date(curr);
        streakEnd = new Date(curr);
        streak += 1;
      } else if (!habit.recurrence.days.includes(curr.getDay())) {
        // habit should not be completed today, so no need to check if we need to change strak status
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
      (c) => c.habitId === habit.id,
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

  return (
    <div className="stats-page">
      {user ? (
        <div>
          <h2 className="stats-title">{user.username}'s habit statistics</h2>
          <div className="stats-list">
            {Object.values(completionStats).map((stat) => (
              <div key={stat.habit.id} className="stats-habit-card">
                <span className="stats-habit-name">{stat.habit.name}</span>
                <span className="stats-detail">
                  {stat.completionStats[0]} completed since{" "}
                  {stat.habit.createdAt}
                </span>
                <span className="stats-detail">
                  {stat.completionStats[1] > 0
                    ? (
                        100.0 *
                        (stat.completionStats[0] / stat.completionStats[1])
                      ).toFixed(1)
                    : 0}
                  % completion rate
                </span>
                <span className="stats-detail">
                  Longest Streak: {stat.streakStats.longestStreak}
                </span>
                <span className="stats-detail">
                  Longest Streak:{" "}
                  {stat.streakStats.longestStreakStart?.toLocaleDateString()} –{" "}
                  {stat.streakStats.longestStreakEnd?.toLocaleDateString()}
                </span>
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
                  <span className="stats-detail">
                    Not currently on a streak
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="stats-no-user">Log in to see your stats!</p>
        </div>
      )}
    </div>
  );
}
