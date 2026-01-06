import { useState } from "react";

export default function Habit() {
  const [done, setDone] = useState(false);

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => setDone(!done)}
      />
      <span
        style={{
          textDecoration: done ? "line-through" : "none"
        }}
      >
        Drink water
      </span>
    </label>
  );
}
