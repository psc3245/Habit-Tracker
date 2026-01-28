const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

export async function onCreateHabit(habit) {
  try {
    const res = await fetch(`${backend_base_url}/habits`, {
      method: "POST", // must be POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: habit.userId,
        name: habit.name,
        schedule: habit.schedule,
        target: habit.target,
        // type: habit.type, ???
        tags: habit.tags,
        createdAt: habit.createdAt ?? new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Create habit failed");
    }

    const h = await res.json();
    console.log(`Created habit: ${h} for userId: ${habit.userId}`);
    return h;
  } catch (err) {
    console.error(err.message);
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
