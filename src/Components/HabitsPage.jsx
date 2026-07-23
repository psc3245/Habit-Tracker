import { useState, useEffect } from "react";
import Habit from "./Habit.jsx";
import CreateEditHabitModal from "./CreateEditHabitModal.jsx";
import "../Style/HabitsPage.css";
import Calendar from "./Calendar.jsx";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";
import * as HabitHelper from "../Helpers/HabitHelper.js";
import { findStreaks, formatDate } from "../Helpers/StreakHelper.js";

export default function HabitsPage({
  user,
  onCreateHabit,
  onUpdateHabit,
  getHabitsByUserId,
  selectedDate,
  setSelectedDate,
  defaultHabitType,
}) {
  console.log(user);

  const initialHabits = [
    {
      id: "10000000000",
      name: "Drink water",
      completed: false,
      type: "checkbox",
      hasTags: false,
      availableTags: [],
      selectedTag: null,
      createdAt: new Date(2026, 0, 1, 12, 0).toISOString(),
      recurrence: { interval: 1, days: [0, 1, 2, 3, 4, 5, 6] },
    },
    {
      id: "200000000000",
      name: "Exercise",
      completed: false,
      type: "checkbox",
      hasTags: false,
      availableTags: [],
      selectedTag: null,
      createdAt: new Date(2026, 0, 1, 12, 0).toISOString(),
      recurrence: { interval: 1, days: [0, 1, 2, 3, 4, 5, 6] },
    },
    {
      id: "30000000000",
      name: "Read",
      completed: false,
      type: "checkbox",
      hasTags: true,
      availableTags: ["Fiction", "Non-fiction", "Articles"],
      selectedTag: null,
      createdAt: new Date(2026, 0, 1, 12, 0).toISOString(),
      recurrence: { interval: 1, days: [0, 1, 2, 3, 4, 5, 6] },
    },
    {
      id: "40000000000",
      name: "Meditate",
      completed: false,
      type: "checkbox",
      hasTags: true,
      availableTags: ["Morning", "Evening"],
      selectedTag: null,
      createdAt: new Date(2026, 0, 1, 12, 0).toISOString(),
      recurrence: { interval: 1, days: [0, 1, 2, 3, 4, 5, 6] },
    },
    {
      id: "5000000000",
      name: "Sleep 8h",
      completed: false,
      type: "checkbox",
      hasTags: false,
      availableTags: [],
      selectedTag: null,
      createdAt: new Date(2026, 0, 1, 12, 0).toISOString(),
      recurrence: { interval: 1, days: [0, 1, 2, 3, 4, 5, 6] },
    },
  ];

  const [habits, setHabits] = useState([]);
  const [pendingCompletions, setPendingCompletions] = useState({});
  const [habitInfo, setHabitInfo] = useState(null);
  const [allCompletions, setAllCompletions] = useState([]);

  const loadAllCompletions = async () => {
    if (!user) return;
    const result = await CompletionHelper.getCompletionsByUserId(user.id);
    setAllCompletions(result);
  };

  useEffect(() => {
    loadAllCompletions();
  }, [user?.id]);

  const getStreakForHabit = (habit) => {
    const merged = new Map(
      allCompletions
        .filter((c) => c.habit_id === habit.id)
        .map((c) => [c.date, c]),
    );
    Object.entries(pendingCompletions).forEach(([habitId, update]) => {
      if (habitId !== String(habit.id)) return;
      const dateKey = formatDate(new Date(update.date));
      if (update.action === "create") {
        merged.set(dateKey, { habit_id: habit.id, date: dateKey });
      } else {
        merged.delete(dateKey);
      }
    });
    return findStreaks(habit, Array.from(merged.values())).currentStreak;
  };

  const syncPendingCompletions = async () => {
    if (!user) return;

    const entries = Object.entries(pendingCompletions);
    if (entries.length === 0) return;

    for (const [habitId, update] of entries) {

      if (update.action === "create") {
        await CompletionHelper.createCompletion(
          habitId,
          user.id,
          update.date,
          update.selectedTag || null,
          update.value || null,
        );
      } else if (update.action === "delete") {
        await CompletionHelper.deleteCompletionByHabitAndDate(
          user.id,
          habitId,
          update.date,
        );
      }
    }

    setPendingCompletions({});
    loadAllCompletions();
  };

  useEffect(() => {
    if (!user) {
      setHabits(initialHabits);
      return;
    }

    async function loadHabits() {
      const backendHabits = await getHabitsByUserId(user.id);
      const mapped = backendHabits.map(HabitHelper.mapHabit);
      setHabits(mapped);
    }

    loadHabits();
  }, [user?.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleHabit = async (id) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit || !user) return;

    const dateAtToggle = new Date(selectedDate);

    if (!habit.completed) {
      setPendingCompletions((prev) => ({
        ...prev,
        [habit.id]: {
          action: "create",
          selectedTag: habit.selectedTag || null,
          value: habit.value || null,
          date: dateAtToggle,
        },
      }));
    } else {
      setPendingCompletions((prev) => ({
        ...prev,
        [habit.id]: {
          action: "delete",
          date: dateAtToggle,
        },
      }));
    }

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  };

  const updateHabitTag = (id, newTag) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, selectedTag: newTag } : h)),
    );
  };

  useEffect(() => {
    return () => {
      syncPendingCompletions();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadCompletionsForDate() {
      if (!user) return;

      await syncPendingCompletions();
      const completions = await CompletionHelper.getCompletionsByUserIdAndDate(
        user.id,
        selectedDate,
      );

      const completionMap = {};
      completions.forEach((c) => {
        completionMap[c.habit_id] = c;
      });

      setHabits((currentHabits) => {
        return currentHabits.map((habit) => {
          const completion = completionMap[habit.id];

          if (completion) {
            let isCompleted = false;

            if (habit.type === "checkbox") {
              isCompleted = true;
            } else if (habit.type === "counter" || habit.type === "duration") {
              isCompleted = (completion.value ?? 0) >= habit.target;
            } else if (habit.type === "slider") {
              isCompleted = completion.value != null;
            }

            return {
              ...habit,
              completed: isCompleted,
              value: Number(completion.value),
              selectedTag: completion.selected_tag,
            };
          }
          return {
            ...habit,
            completed: false,
            value: habit.defaultValue,
            selectedTag: null,
          };
        });
      });
    }

    loadCompletionsForDate();
  }, [selectedDate, user?.id]);

  const updateHabitValue = (id, newValue) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit || !user) return;

    const dateAtChange = new Date(selectedDate);

    setPendingCompletions((prev) => ({
      ...prev,
      [habit.id]: {
        action: "create",
        selectedTag: habit.selectedTag || null,
        value: newValue,
        date: dateAtChange,
      },
    }));

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, value: newValue } : h)),
    );
  };

  const isHabitScheduledForDate = (habit, date) => {
    const habitDate = new Date(habit.createdAt);
    habitDate.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (habitDate > compareDate) {
      return false;
    }
    if (!habit.recurrence) return true;

    const dayCheck = habit.recurrence.days.includes(date.getDay());
    const weeksSinceCreation = Math.floor(
      (compareDate - habitDate) / (7 * 24 * 60 * 60 * 1000),
    );
    const intervalCheck = weeksSinceCreation % habit.recurrence.interval === 0;

    return dayCheck && intervalCheck;
  };

  const onEdit = (habitInfo) => {
    if (!user) {
      alert("No current user - log in first!");
      return;
    }
    setHabitInfo(habitInfo);
    setIsModalOpen(true);
  };

  return (
    <div className="daily-page">
      <div className="page-header">
        <h2 className="daily-title">{user ? user.first_name : ""} {user ? "'s " : ""} Daily Habits</h2>
        <div className="daily-habit-btns">
          <button
            className="new-habit-btn"
            onClick={() => {
              if (!user) {
                alert("No current user - log in first!");
                return;
              }
              setIsModalOpen(true);
              setIsCalendarOpen(false);
            }}
          >
            + New Habit
          </button>
          <div className="date-picker-container">
            <button
              className="daily-date"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              {selectedDate.toLocaleDateString()}
            </button>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
            />
          </div>
          <button
            className="daily-date"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </button>
        </div>
        {isCalendarOpen && (
          <div
            className="calendar-backdrop"
            onClick={() => setIsCalendarOpen(false)}
          />
        )}
      </div>
      <div className="daily-habits-list">
        {habits.filter((habit) => isHabitScheduledForDate(habit, selectedDate))
          .length === 0 && (
          <p className="daily-empty">No habits scheduled for this day.</p>
        )}
        {habits
          .filter((habit) => isHabitScheduledForDate(habit, selectedDate))
          .map((habit) => {
            return (
              <Habit
                key={habit.id}
                id={habit.id}
                name={habit.name}
                completed={habit.completed}
                type={habit.type}
                hasTags={habit.hasTags}
                tag={habit.selectedTag}
                availableTags={habit.availableTags}
                value={habit.value || 0}
                target={habit.target || 1}
                recurrence={habit.recurrence}
                streak={getStreakForHabit(habit)}
                onToggle={() => toggleHabit(habit.id)}
                onTagChange={(newTag) => updateHabitTag(habit.id, newTag)}
                onValueChange={(newValue) =>
                  updateHabitValue(habit.id, newValue)
                }
                sliderMin={habit.sliderMin}
                colorLow={habit.colorLow}
                colorMid={habit.colorMid}
                colorHigh={habit.colorHigh}
                onEdit={onEdit}
              />
            );
          })}
      </div>

      <CreateEditHabitModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setHabitInfo(null);
        }}
        onCreateHabit={onCreateHabit}
        onUpdateHabit={onUpdateHabit}
        setHabits={setHabits}
        selectedDate={selectedDate}
        habitInfo={habitInfo}
        handleDeleteHabit={HabitHelper.onDeleteHabit}
        defaultHabitType={defaultHabitType}
      />
    </div>
  );
}
