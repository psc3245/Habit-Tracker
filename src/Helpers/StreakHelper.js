export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Computes current/longest streaks for a habit given its full completion history.
// `today` is treated specially: if it's a scheduled day that hasn't been
// completed yet, the streak is left intact (the day isn't over yet) instead
// of being reported as broken.
export function findStreaks(habit, completions, today = new Date()) {
  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);

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

  while (curr < normalizedToday) {
    const scheduled = habit.recurrence.days.includes(curr.getDay());
    const completed = completionDates.has(formatDate(curr));

    if (scheduled && completed && streak > 0) {
      streak += 1;
      streakEnd = new Date(curr);
    } else if (scheduled && !completed && streak > 0) {
      streak = 0;
      streakEnd = new Date(curr);
      streakStart = null;
    } else if (scheduled && completed && streak === 0) {
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

  if (
    curr.getTime() === normalizedToday.getTime() &&
    habit.recurrence.days.includes(normalizedToday.getDay()) &&
    completionDates.has(formatDate(normalizedToday))
  ) {
    if (streak === 0) streakStart = new Date(normalizedToday);
    streakEnd = new Date(normalizedToday);
    streak += 1;
  }

  if (longestStreak <= streak) {
    longestStreak = streak;
    longestStreakStart = streakStart;
    longestStreakEnd = streakEnd;
  }

  return {
    currentStreak: streak,
    currentStreakStart: streakStart,
    longestStreak: longestStreak,
    longestStreakStart: longestStreakStart,
    longestStreakEnd: longestStreakEnd,
  };
}
