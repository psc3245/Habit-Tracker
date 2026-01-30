const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

export async function createCompletion(
  habitId,
  userId,
  date,
  selectedTag,
  value,
) {
  try {
    const res = await fetch(`${backend_base_url}/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habitId,
        userId,
        date: date.toISOString(),
        selectedTag,
        value,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Create completion failed");
    }

    const completion = await res.json();
    console.log("Created completion:", completion);
    return completion;
  } catch (err) {
    console.error(err.message);
  }
}

export async function getCompletionsByUserIdAndDate(userId, date) {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  try {
    const res = await fetch(
      `${backend_base_url}/completions?userId=${userId}&date=${formatDate(date)}`,
      { method: "GET", headers: { "Content-Type": "application/json" } },
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        err.error ||
          `Fetch completions failed for userId ${userId} and ${date.toISOString()}`,
      );
    }

    const completions = await res.json();
    completions.forEach((element) => {
      console.log(element);
    });
    return completions;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

export async function updateCompletion(completionId, selectedTag, value) {
  try {
    const res = await fetch(
      `${backend_base_url}/completions/${completionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedTag: selectedTag, value: value }),
      },
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        err.error ||
          `Fetch completions failed for userId ${userId} and ${date.toISOString()}`,
      );
    }

    const update = await res.json();
    console.log(update);
    return update;
  } catch (err) {
    console.error(err.message);
  }
}
