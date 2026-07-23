import { useState, useEffect, useMemo } from "react";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import { formatDate } from "../Helpers/StreakHelper.js";
import "../Style/History.css";

const WEEKS_SHOWN = 18;
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildWeeks(today) {
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));
  const weeks = [];
  for (let w = WEEKS_SHOWN - 1; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(end);
      date.setDate(date.getDate() - w * 7 - (6 - d));
      week.push(date);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function History({ user }) {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [rawHabits, allCompletions] = await Promise.all([
        HabitHelper.getHabitsByUserId(user.id),
        CompletionHelper.getCompletionsByUserId(user.id),
      ]);
      const mapped = rawHabits.map(HabitHelper.mapHabit);
      setHabits(mapped);
      setCompletions(allCompletions);
      if (mapped.length > 0) setSelectedHabitId(mapped[0].id);
    };
    load();
  }, [user?.id]);

  const weeks = buildWeeks(today);

  const habit = habits.find((h) => h.id === selectedHabitId);

  const completionByDate = useMemo(() => {
    if (!habit) return new Map();
    const map = new Map();
    completions
      .filter((c) => c.habit_id === habit.id)
      .forEach((c) => map.set(c.date, c));
    return map;
  }, [habit, completions]);

  const getLevel = (date) => {
    if (!habit) return -1;
    const habitStart = new Date(habit.createdAt);
    habitStart.setHours(0, 0, 0, 0);
    if (date < habitStart || date > today) return -1;
    if (!habit.recurrence.days.includes(date.getDay())) return -1;

    const completion = completionByDate.get(formatDate(date));
    if (!completion) return 0;

    if (habit.type === "counter" || habit.type === "duration") {
      const ratio = habit.target ? (completion.value ?? 0) / habit.target : 1;
      if (ratio >= 1) return 4;
      if (ratio >= 0.66) return 3;
      if (ratio >= 0.33) return 2;
      return 1;
    }
    if (habit.type === "slider" || habit.type === "rating") {
      return completion.value != null ? 4 : 0;
    }
    if (habit.type === "shorttext" || habit.type === "journal") {
      return (completion.text_value ?? "").trim() !== "" ? 4 : 0;
    }
    return 4; // checkbox / checknote: binary
  };

  if (!user) {
    return (
      <div className="history-page">
        <h2 className="history-title">History</h2>
        <p className="history-no-user">Log in to see your habit history.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h2 className="history-title">History</h2>
      {habits.length === 0 ? (
        <p className="history-empty">No habits yet.</p>
      ) : (
        <>
          <select
            className="history-habit-select"
            value={selectedHabitId || ""}
            onChange={(e) => setSelectedHabitId(e.target.value)}
          >
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <div className="history-heatmap-scroll">
            <div className="history-heatmap">
              <div className="history-day-labels">
                {DAY_LABELS.map((label, i) => (
                  <span key={i} className="history-day-label">
                    {label}
                  </span>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="history-week-column">
                  {week.map((date, di) => {
                    const level = getLevel(date);
                    return (
                      <div
                        key={di}
                        className={`history-cell history-cell--${level}`}
                        title={`${date.toLocaleDateString()}${level >= 0 ? (level > 0 ? " — done" : " — missed") : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="history-legend">
            <span>Less</span>
            <span className="history-cell history-cell--0" />
            <span className="history-cell history-cell--1" />
            <span className="history-cell history-cell--2" />
            <span className="history-cell history-cell--3" />
            <span className="history-cell history-cell--4" />
            <span>More</span>
          </div>
        </>
      )}
    </div>
  );
}
