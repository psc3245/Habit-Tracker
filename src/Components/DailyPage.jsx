import { useState, useEffect } from "react";
import Habit from "./Habit";
import CreateHabitModal from "./CreateHabitModal";
import "../Style/DailyPage.css";
import Calendar from "./Calendar";

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

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  };

  const updateHabitTag = (id, newTag) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, selectedTag: newTag } : h)),
    );
  };

  return (
    <div className="daily-page">
      <div className="page-header">
        <h2 className="daily-title">Daily Habits</h2>
        <div className="daily-habit-btns">
          <button
            className="new-habit-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + New Habit
          </button>
          <button className="daily-date" onClick={() => setIsCalendarOpen(true)}>
            {" "}
            {new Date().toLocaleDateString()}
          </button>
          <Calendar 
            selectedDate={new Date()}
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
          />
        </div>
      </div>
      {habits.map((habit) => (
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
