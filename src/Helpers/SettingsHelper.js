const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL;

export async function createSettings(userId) {
  try {
    const res = await fetch(`${backend_base_url}/settings/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const settings = await res.json();
    return {
      display_mode: settings.display_mode,
      left_default_page: settings.left_default_page,
      right_default_page: settings.right_default_page,
      default_habit_type: settings.default_habit_type,
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function loadSettingsForUser(userId) {
  try {
    const settingsRes = await fetch(`${backend_base_url}/settings/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!settingsRes.ok)
      throw new Error(`Failed to fetch settings for id ${userId}`);
    const settings = await settingsRes.json();

    return {
      display_mode: settings.display_mode,
      left_default_page: settings.left_default_page,
      right_default_page: settings.right_default_page,
      default_habit_type: settings.default_habit_type,
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function updateSettings(id, settings) {
  try {
    const {
      display_mode,
      left_default_page,
      right_default_page,
      default_habit_type,
    } = settings;

    const res = await fetch(`${backend_base_url}/settings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_mode,
        left_default_page,
        right_default_page,
        default_habit_type,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Update settings failed");
    }

    return await res.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
