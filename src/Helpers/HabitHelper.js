const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

export const HABIT_TYPE_LABELS = {
  checkbox: "Checkbox",
  counter: "Counter",
  duration: "Duration",
  slider: "Slider",
  rating: "Rating",
  checknote: "Yes/No + Note",
  shorttext: "Short Text",
  journal: "Journal",
};

export function mapHabit(habit) {
    const defaultVal =
      habit.type === "slider"
        ? Math.floor(((Number(habit.slider_min) || 1) + (Number(habit.target) || 10)) / 2)
        : habit.type === "rating"
          ? 3
          : 0;

    return {
      id: habit.habit_id,
      name: habit.name,
      completed: false,
      type: habit.type || "checkbox",
      target: Number(habit.target) || 1,
      recurrence: {
        interval: Number(habit.recurrence_interval),
        days: habit.recurrence_days.map(Number),
      },
      value: Number(defaultVal),
      defaultValue: defaultVal,
      textValue: "",
      hasTags: (habit.available_tags ?? []).length > 0,
      availableTags: habit.available_tags ?? [],
      selectedTag: null,
      createdAt: habit.created_at,
      sliderMin: habit.slider_min,
      colorLow: habit.color_low,
      colorMid: habit.color_mid,
      colorHigh: habit.color_high,
      archived: habit.archived ?? false,
    };
  };

export async function onCreateHabit(habit) {
  try {
    const createdAt = new Date(habit.createdAt);
    createdAt.setHours(0, 0, 0, 0);
    const createdAtISO = createdAt.toISOString();

    const res = await fetch(`${backend_base_url}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: habit.userId,
        name: habit.name,
        target: habit.target,
        type: habit.type,
        availableTags: habit.availableTags,
        createdAt: createdAtISO,
        sliderMin: habit.sliderMin,
        colorLow: habit.colorLow,
        colorMid: habit.colorMid,
        colorHigh: habit.colorHigh,
        recurrence: habit.recurrence,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Create habit failed");
    }

    const h = await res.json();
    return h;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function getHabitsByUserId(userId) {
  try {
    const res = await fetch(`${backend_base_url}/users/${userId}/habits`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Fetch habits failed");
    }
    const habits = await res.json();
    return habits;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

export async function onUpdateHabit(habit, habitId) {
  try {
    const createdAt = new Date(habit.createdAt);
    createdAt.setHours(0, 0, 0, 0);
    const createdAtISO = createdAt.toISOString();

    const res = await fetch(`${backend_base_url}/habits/${habitId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: habit.userId,
        name: habit.name,
        target: habit.target,
        type: habit.type,
        availableTags: habit.availableTags,
        sliderMin: habit.sliderMin,
        colorLow: habit.colorLow,
        colorMid: habit.colorMid,
        colorHigh: habit.colorHigh,
        recurrence: habit.recurrence,
        archived: habit.archived,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Update habit failed");
    }

    const h = await res.json();
    return h;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function onDeleteHabit(habitId) {
  try {
    const res = await fetch(`${backend_base_url}/habits/${habitId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete habit");
    }

    return true;
  } catch (err) {
    console.error(err.message);
    return false;
  }
}
