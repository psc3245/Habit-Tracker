import { useState, useEffect } from "react";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import { findStreaks, formatDate } from "../Helpers/StreakHelper.js";
import "../Style/Achievements.css";

const BADGES = [
  {
    id: "first-step",
    icon: "🌱",
    label: "First Steps",
    description: "Complete a habit for the first time.",
    check: (ctx) => ctx.totalCompletions >= 1,
  },
  {
    id: "streak-3",
    icon: "🔥",
    label: "3-Day Streak",
    description: "Hit a 3-day streak on any habit.",
    check: (ctx) => ctx.maxLongestStreak >= 3,
  },
  {
    id: "streak-7",
    icon: "🔥",
    label: "One Week Strong",
    description: "Hit a 7-day streak on any habit.",
    check: (ctx) => ctx.maxLongestStreak >= 7,
  },
  {
    id: "streak-14",
    icon: "🔥",
    label: "Two Weeks In",
    description: "Hit a 14-day streak on any habit.",
    check: (ctx) => ctx.maxLongestStreak >= 14,
  },
  {
    id: "streak-30",
    icon: "🏆",
    label: "30-Day Streak",
    description: "Hit a 30-day streak on any habit.",
    check: (ctx) => ctx.maxLongestStreak >= 30,
  },
  {
    id: "streak-60",
    icon: "🏆",
    label: "60-Day Streak",
    description: "Hit a 60-day streak on any habit.",
    check: (ctx) => ctx.maxLongestStreak >= 60,
  },
  {
    id: "streak-100",
    icon: "💎",
    label: "Centurion Streak",
    description: "Hit a 100-day streak on any habit.",
    check: (ctx) => ctx.maxLongestStreak >= 100,
  },
  {
    id: "completions-50",
    icon: "⭐",
    label: "50 Completions",
    description: "Complete habits 50 times, all-time.",
    check: (ctx) => ctx.totalCompletions >= 50,
  },
  {
    id: "completions-100",
    icon: "🌟",
    label: "Century Club",
    description: "Complete habits 100 times, all-time.",
    check: (ctx) => ctx.totalCompletions >= 100,
  },
  {
    id: "completions-500",
    icon: "👑",
    label: "500 Club",
    description: "Complete habits 500 times, all-time.",
    check: (ctx) => ctx.totalCompletions >= 500,
  },
  {
    id: "perfect-week",
    icon: "✅",
    label: "Perfect Week",
    description: "Complete every scheduled habit for 7 days straight.",
    check: (ctx) => ctx.perfectWeek,
  },
  {
    id: "collector",
    icon: "📚",
    label: "Habit Collector",
    description: "Create 5 or more habits.",
    check: (ctx) => ctx.habitCount >= 5,
  },
  {
    id: "variety",
    icon: "🎨",
    label: "Mix It Up",
    description: "Use 3 or more different habit types.",
    check: (ctx) => ctx.typesUsed >= 3,
  },
];

const PLACEHOLDER_EARNED = new Set(["first-step", "streak-3", "streak-7", "collector"]);

export default function Achievements({ user }) {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [rawHabits, allCompletions] = await Promise.all([
        HabitHelper.getHabitsByUserId(user.id),
        CompletionHelper.getCompletionsByUserId(user.id),
      ]);
      setHabits(rawHabits.map(HabitHelper.mapHabit));
      setCompletions(allCompletions);
    };
    load();
  }, [user?.id]);

  const computeContext = () => {
    const totalCompletions = completions.length;
    const maxLongestStreak = habits.reduce((max, habit) => {
      const { longestStreak } = findStreaks(habit, completions, today);
      return Math.max(max, longestStreak);
    }, 0);

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d;
    });
    const completionDatesByHabit = {};
    habits.forEach((habit) => {
      completionDatesByHabit[habit.id] = new Set(
        completions.filter((c) => c.habit_id === habit.id).map((c) => c.date),
      );
    });
    const perfectWeek =
      habits.length > 0 &&
      last7.every((day) =>
        habits
          .filter((h) => !h.archived && h.recurrence.days.includes(day.getDay()))
          .every((h) => completionDatesByHabit[h.id]?.has(formatDate(day))),
      );

    return {
      totalCompletions,
      maxLongestStreak,
      perfectWeek,
      habitCount: habits.length,
      typesUsed: new Set(habits.map((h) => h.type)).size,
    };
  };

  const renderBadge = (badge, earned) => (
    <div
      key={badge.id}
      className={`badge-tile${earned ? " badge-tile--earned" : " badge-tile--locked"}`}
    >
      <span className="badge-icon">{earned ? badge.icon : "🔒"}</span>
      <span className="badge-label">{badge.label}</span>
      <span className="badge-description">{badge.description}</span>
    </div>
  );

  if (!user) {
    return (
      <div className="achievements-page">
        <h2 className="achievements-title">Achievements</h2>
        <p className="achievements-no-user">
          Log in to start earning achievements.
        </p>
        <div className="badge-grid">
          {BADGES.map((badge) => renderBadge(badge, PLACEHOLDER_EARNED.has(badge.id)))}
        </div>
      </div>
    );
  }

  const ctx = computeContext();
  const earnedCount = BADGES.filter((b) => b.check(ctx)).length;

  return (
    <div className="achievements-page">
      <h2 className="achievements-title">
        {user.first_name}'s Achievements
      </h2>
      <p className="achievements-progress">
        {earnedCount} / {BADGES.length} earned
      </p>
      <div className="badge-grid">
        {BADGES.map((badge) => renderBadge(badge, badge.check(ctx)))}
      </div>
    </div>
  );
}
