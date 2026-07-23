import { useEffect, useRef, useState } from "react";
import CheckboxHabit from "./Habits/CheckboxHabit.jsx";
import CounterHabit from "./Habits/CounterHabit.jsx";
import DurationHabit from "./Habits/DurationHabit.jsx";
import SliderHabit from "./Habits/SliderHabit.jsx";

const HABIT_TYPE_COMPONENTS = {
  checkbox: CheckboxHabit,
  counter: CounterHabit,
  duration: DurationHabit,
  slider: SliderHabit,
};

export default function Habit({
  name,
  completed,
  type,
  hasTags,
  tag,
  availableTags,
  onToggle,
  onTagChange,
  value,
  onValueChange,
  target,
  sliderMin,
  colorLow,
  colorMid,
  colorHigh,
  onEdit,
  recurrence,
  streak = 0,
  ...otherProps
}) {
  const HabitComponent = HABIT_TYPE_COMPONENTS[type];
  const [celebrate, setCelebrate] = useState(false);
  const wasCompleted = useRef(completed);

  useEffect(() => {
    if (completed && !wasCompleted.current) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 850);
      wasCompleted.current = completed;
      return () => clearTimeout(timer);
    }
    wasCompleted.current = completed;
  }, [completed]);

  return (
    <div
      className={`habit-row-wrapper${celebrate ? " celebrating" : ""}`}
    >
      {streak > 0 && (
        <span className="streak-badge" title={`${streak}-day streak`}>
          🔥 {streak}
        </span>
      )}
      <HabitComponent
        name={name}
        completed={completed}
        hasTags={hasTags}
        tag={tag}
        target={target}
        availableTags={availableTags}
        onToggle={onToggle}
        onTagChange={onTagChange}
        value={value}
        onValueChange={onValueChange}
        sliderMin={sliderMin}
        colorLow={colorLow}
        colorMid={colorMid}
        colorHigh={colorHigh}
        onEdit={onEdit}
        recurrence={recurrence}
        {...otherProps}
      />
      {celebrate && (
        <div className="habit-celebration" aria-hidden="true">
          <span className="habit-celebration-check">✓</span>
          <span className="spark spark-1">✦</span>
          <span className="spark spark-2">✦</span>
          <span className="spark spark-3">✦</span>
          <span className="spark spark-4">✦</span>
        </div>
      )}
    </div>
  );
}
