export function getReminderSettings(userId) {
  try {
    const raw = localStorage.getItem(`reminders_${userId}`);
    if (!raw) return { enabled: false, time: "18:00" };
    return JSON.parse(raw);
  } catch {
    return { enabled: false, time: "18:00" };
  }
}

export function setReminderSettings(userId, settings) {
  localStorage.setItem(`reminders_${userId}`, JSON.stringify(settings));
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function alreadyNotifiedToday(userId) {
  return localStorage.getItem(`reminded_${userId}`) === todayKey();
}

function markNotifiedToday(userId) {
  localStorage.setItem(`reminded_${userId}`, todayKey());
}

// Checks whether it's time to remind the user, and fires a browser
// notification listing incomplete habits scheduled for today. Intended to
// be called on an interval while the app is open (no service worker/push,
// so it only works while a tab is open).
export function maybeNotify(userId, incompleteHabitNames) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;

  const { enabled, time } = getReminderSettings(userId);
  if (!enabled) return;
  if (alreadyNotifiedToday(userId)) return;

  const now = new Date();
  const [hh, mm] = (time || "18:00").split(":").map(Number);
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);

  if (now < target) return;
  if (incompleteHabitNames.length === 0) return;

  const body =
    incompleteHabitNames.length <= 3
      ? incompleteHabitNames.join(", ")
      : `${incompleteHabitNames.slice(0, 3).join(", ")} + ${incompleteHabitNames.length - 3} more`;

  new Notification("Habit Tracker reminder", {
    body: `Still to do today: ${body}`,
  });
  markNotifiedToday(userId);
}
