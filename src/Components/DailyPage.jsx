import { useState, useEffect } from "react";
import Habit from "./Habit";
import CreateHabitModal from "./CreateHabitModal";
import "../Style/DailyPage.css";
import Calendar from "./Calendar";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";

export default function DailyPage({ user, onCreateHabit, getHabitsByUserId }) {
  const mapHabit = (habit) => ({
    id: habit.id,
    name: habit.name,
    completed: false,
    type: "checkbox",
    hasTags: (habit.availableTags ?? []).length > 0,
    availableTags: habit.availableTags ?? [],
    selectedTag: null,
  });

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

    console.log("Syncing pending completions:", pendingCompletions);
    console.log("Entries to sync:", entries);

    for (const [habitId, update] of entries) {
      console.log("Processing habitId:", habitId, "update:", update);

      if (update.action === "create") {
        const result = await CompletionHelper.createCompletion(
          Number(habitId),
          user.id,
          selectedDate,
          update.selectedTag || null,
          update.value || null,
        );
        console.log("Create completion result:", result);
      } else if (update.action === "delete") {
        const result = await CompletionHelper.deleteCompletionByHabitAndDate(
          user.id,
          Number(habitId),
          selectedDate,
        );
        console.log("Delete completion result:", result);
      }
    }

    console.log("Clearing pending completions");
    setPendingCompletions({});
  };

  useEffect(() => {
    if (!user) {
      setHabits(initialHabits);
      return;
    }

    async function loadHabits() {
      setHabits((await getHabitsByUserId(user.id)).map(mapHabit));
    }

    loadHabits();
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleHabit = async (id) => {
    console.log("toggleHabit called with id:", id);

    const habit = habits.find((h) => h.id === id);
    console.log("Found habit:", habit);

    if (!habit || !user) {
      console.log("Exiting - no habit or no user");
      return;
    }

    if (!habit.completed) {
      console.log("Adding to pending completions - CREATE");
      setPendingCompletions((prev) => {
        const updated = {
          ...prev,
          [habit.id]: {
            action: "create",
            selectedTag: habit.selectedTag || null,
            value: habit.value || null,
            selectedDate: selectedDate,
          },
        };
        console.log("Updated pendingCompletions:", updated);
        return updated;
      });
    } else {
      console.log("Adding to pending completions - DELETE");
      setPendingCompletions((prev) => {
        const updated = {
          ...prev,
          [habit.id]: { action: "delete" },
        };
        console.log("Updated pendingCompletions:", updated);
        return updated;
      });
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

      const updatedHabits = habits.map((habit) => {
        const completion = completionMap[habit.id];

        if (completion) {
          let isCompleted = false;

          if (habit.type === "checkbox") {
            isCompleted = true;
          } else if (habit.type === "counter" || habit.type === "duration") {
            isCompleted = (completion.value || 0) >= habit.target;
          } else if (habit.type === "scale") {
            isCompleted = completion.value != null;
          }

          return {
            ...habit,
            completed: isCompleted,
            value: completion.value,
            selectedTag: completion.selectedTag,
          };
        }

        return {
          ...habit,
          completed: false,
          value: null,
          selectedTag: null,
        };
      });

      setHabits(updatedHabits);
    }

    loadCompletionsForDate();
  }, [selectedDate, user]);

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
      {console.log("All habits:", habits)}
      {console.log("Selected date:", selectedDate)}
      {habits
        .filter((habit) => {
          const habitDate = new Date(habit.createdAt);
          habitDate.setHours(0, 0, 0, 0);

          const compareDate = new Date(selectedDate);
          compareDate.setHours(0, 0, 0, 0);

          return habitDate <= compareDate;
        })
        .map((habit) => (
          <Habit
            key={habit.id}
            name={habit.name}
            completed={habit.completed}
            type={habit.type}
            hasTags={habit.hasTags}
            tag={habit.selectedTag}
            availableTags={habit.availableTags}
            onToggle={() => toggleHabit(habit.id)}
            onTagChange={(newTag) => updateHabitTag(habit.id, newTag)}
          />
        ))}

      <CreateHabitModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateHabit={onCreateHabit}
        setHabits={setHabits}
      />
    </div>
  );
}
