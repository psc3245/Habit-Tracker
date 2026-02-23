import { useState, useEffect } from "react";
import * as CompletionHelper from "../Helpers/CompletionHelper.js";

export default function AtAGlance({ user, selectedDate }) {
  const [timeframe, setTimeframe] = useState("weekly");
  const [completions, setCompletions] = useState([]);

  const getWeekDateRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return [startOfWeek, endOfWeek];
  };

  const getMonthDateRange = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return [startOfMonth, endOfMonth];
  };

  useEffect(() => {
    const getCompletions = async () => {
      if (!user) return;
      let dates;
      if (timeframe === "weekly") dates = getWeekDateRange(selectedDate);
      else dates = getMonthDateRange(selectedDate);

      const result = await CompletionHelper.getCompletionsByUserIdAndDateRange(
        user.id,
        dates[0],
        dates[1],
      );
      setCompletions(result);
    };

    getCompletions();
  }, [user, timeframe, selectedDate]);

  return (
    <>
      <select
        name="timeframe"
        id="timeframe"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
      >
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      {user ? (
        <>
        <h2>User {user.username}</h2>
        </>
      ) : (
        <div>
          <p>No user id, default page</p>
        </div>
      )}
    </>
  );
}
