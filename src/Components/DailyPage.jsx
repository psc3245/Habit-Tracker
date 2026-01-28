import { useState, useEffect } from "react";
import Habit from "./Habit";
import CreateHabitModal from "./CreateHabitModal";
import "../Style/DailyPage.css";

export default function DailyPage({ user, onCreateHabit }) {
  const mapHabit = (habit) => {
    return {
      id: habit.id,
      name: habit.name,
      completed: false, // later from completion history
      type: "checkbox",
      hasTags: habit.tags.length > 0,
      tag: habit.tags[0] ?? null, // UI expects single tag
    };
  };

  const initialHabits = [
    {
      id: "1",
      name: "Drink water",
      completed: false,
      type: "checkbox",
      hasTags: false,
    },
    {
      id: "2",
      name: "Exercise",
      completed: false,
      type: "checkbox",
      hasTags: false,
    },
    {
      id: "3",
      name: "Read",
      completed: false,
      type: "checkbox",
      hasTags: true,
      tag: "Morning",
    },
    {
      id: "4",
      name: "Meditate",
      completed: false,
      type: "checkbox",
      hasTags: true,
      tag: "Evening",
    },
    {
      id: "5",
      name: "Sleep 8h",
      completed: false,
      type: "checkbox",
      hasTags: false,
    },
  ];

  const [habits, setHabits] = useState([]);

  useEffect(() => {
    if (!user) {
      setHabits(initialHabits);
      return;
    }

    async function loadHabits() {
      // TODO: fetch habits, map to a better format
    }

    loadHabits();
  }, [user]);

  const [availableTags, setAvailableTags] = useState([
    "Morning",
    "Evening",
    "Afternoon",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  };

  const updateHabitTag = (id, newTag) => {
    if (newTag === "new-tag") {
      const tagName = prompt("Enter new tag name:");
      if (tagName && tagName.trim()) {
        setAvailableTags((prev) => [...prev, tagName.trim()]);
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? { ...h, tag: tagName.trim() } : h)),
        );
      }
    } else {
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, tag: newTag } : h)),
      );
    }
  };

  const createHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      type: habitData.type,
      completed: false,
      hasTags: habitData.hasTags,
      tag: habitData.hasTags ? "--" : undefined,
      dailyRequirement: habitData.dailyRequirement,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  return (
    <div className="daily-page">
      <div className="page-header">
        <h2 className="daily-title">Daily Habits</h2>
        <button className="new-habit-btn" onClick={() => setIsModalOpen(true)}>
          + New Habit
        </button>
      </div>
      {habits.map((habit) => (
        <Habit
          key={habit.id}
          habit={habit.name}
          completed={habit.completed}
          type={habit.type}
          hasTags={habit.hasTags}
          tag={habit.tag}
          availableTags={availableTags}
          onToggle={() => toggleHabit(habit.id)}
          onTagChange={(newTag) => updateHabitTag(habit.id, newTag)}
        />
      ))}

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateHabit={createHabit}
        availableTags={availableTags}
      />
    </div>
  );
}
