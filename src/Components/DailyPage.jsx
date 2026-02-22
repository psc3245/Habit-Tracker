import { useState, useEffect } from "react";
import Habit from "./Habit";
import CreateEditHabitModal from "./CreateEditHabitModal";
import "../Style/DailyPage.css";
import Calendar from "./Calendar";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";

export default function DailyPage({ user, onCreateHabit, getHabitsByUserId }) {
  const mapHabit = (habit) => {
    const defaultVal =
      habit.type === "slider"
        ? Math.floor(((habit.sliderMin || 1) + (habit.target || 10)) / 2)
        : 0;

    return {
      id: habit.id,
      name: habit.name,
      completed: false,
      type: habit.type || "checkbox",
      target: habit.target || 1,
      recurrence: habit.recurrence,
      value: defaultVal,
      defaultValue: defaultVal,
      hasTags: (habit.availableTags ?? []).length > 0,
      availableTags: habit.availableTags ?? [],
      selectedTag: null,
      createdAt: habit.createdAt,
      sliderMin: habit.sliderMin,
      colorLow: habit.colorLow,
      colorMid: habit.colorMid,
      colorHigh: habit.colorHigh,
    };
  };

  const initialHabits = [
    {
      id: "10000000000",
      name: "Drink water",
      completed: false,
      type: "checkbox",
      hasTags: false,
      availableTags: [],
      selectedTag: null,
    },
    {
      id: "200000000000",
      name: "Exercise",
      completed: false,
      type: "checkbox",
      hasTags: false,
      availableTags: [],
      selectedTag: null,
    },
    {
      id: "30000000000",
      name: "Read",
      completed: false,
      type: "checkbox",
      hasTags: true,
      availableTags: ["Fiction", "Non-fiction", "Articles"],
      selectedTag: null,
    },
    {
      id: "40000000000",
      name: "Meditate",
      completed: false,
      type: "checkbox",
      hasTags: true,
      availableTags: ["Morning", "Evening"],
      selectedTag: null,
    },
    {
      id: "5000000000",
      name: "Sleep 8h",
      completed: false,
      type: "checkbox",
      hasTags: false,
      availableTags: [],
      selectedTag: null,
    },
  ];

  const [habits, setHabits] = useState([]);

  const [pendingCompletions, setPendingCompletions] = useState({});

  const syncPendingCompletions = async () => {
    const entries = Object.entries(pendingCompletions);

    for (const [habitId, update] of entries) {
      if (update.action === "create") {
        await CompletionHelper.createCompletion(
          Number(habitId),
          user.id,
          update.date,
          update.selectedTag || null,
          update.value || null,
        );
      } else if (update.action === "delete") {
        await CompletionHelper.deleteCompletionByHabitAndDate(
          user.id,
          Number(habitId),
          update.date,
        );
      }
    }

    setPendingCompletions({});
  };

  useEffect(() => {
    if (!user) {
      setHabits(initialHabits);
      return;
    }

    async function loadHabits() {
      const backendHabits = await getHabitsByUserId(user.id);
      const mapped = backendHabits.map(mapHabit);
      setHabits(mapped);
    }

    loadHabits();
  }, [user?.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

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
      await syncPendingCompletions();
      const completions = await CompletionHelper.getCompletionsByUserIdAndDate(
        user.id,
        selectedDate,
      );

      const completionMap = {};
      completions.forEach((c) => {
        completionMap[c.habitId] = c;
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
              value: completion.value,
              selectedTag: completion.selectedTag,
            };
          }
          console.log("No completion, using defaultValue:", habit.defaultValue);
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
  }, [selectedDate, user?.id, habits.length]);

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

    if (habitDate > compareDate) return false;
    if (!habit.recurrence) return true;

    const dayCheck = habit.recurrence.days.includes(date.getDay());
    const weeksSinceCreation = Math.floor(
      (compareDate - habitDate) / (7 * 24 * 60 * 60 * 1000),
    );
    const intervalCheck = weeksSinceCreation % habit.recurrence.interval === 0;

    return dayCheck && intervalCheck;
  };

  const onEdit = (habitInfo) => {
    console.log(habitInfo);
  }

  return (
    <div className="daily-page">
      <div className="page-header">
        <h2 className="daily-title">Daily Habits</h2>
        <div className="daily-habit-btns">
          <button
            className="new-habit-btn"
            onClick={() => {
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
        </div>
        {isCalendarOpen && (
          <div
            className="calendar-backdrop"
            onClick={() => setIsCalendarOpen(false)}
          />
        )}
      </div>
      {habits
        .filter((habit) => isHabitScheduledForDate(habit, selectedDate))
        .map((habit) => {
          return (
            <Habit
              key={habit.id}
              name={habit.name}
              completed={habit.completed}
              type={habit.type}
              hasTags={habit.hasTags}
              tag={habit.selectedTag}
              availableTags={habit.availableTags}
              value={habit.value || 0}
              target={habit.target || 1}
              onToggle={() => toggleHabit(habit.id)}
              onTagChange={(newTag) => updateHabitTag(habit.id, newTag)}
              onValueChange={(newValue) => updateHabitValue(habit.id, newValue)}
              sliderMin={habit.sliderMin}
              colorLow={habit.colorLow}
              colorMid={habit.colorMid}
              colorHigh={habit.colorHigh}
              onEdit = {onEdit}
            />
          );
        })}

      <CreateEditHabitModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateHabit={onCreateHabit}
        setHabits={setHabits}
        selectedDate={selectedDate}
      />
    </div>
  );
}
