import { useEffect, useRef, useState } from "react";
import CheckboxHabit from "./Habits/CheckboxHabit.jsx";
import CounterHabit from "./Habits/CounterHabit.jsx";
import DurationHabit from "./Habits/DurationHabit.jsx";
import SliderHabit from "./Habits/SliderHabit.jsx";
import RatingHabit from "./Habits/RatingHabit.jsx";
import CheckNoteHabit from "./Habits/CheckNoteHabit.jsx";
import ShortTextHabit from "./Habits/ShortTextHabit.jsx";
import JournalHabit from "./Habits/JournalHabit.jsx";

const HABIT_TYPE_COMPONENTS = {
  checkbox: CheckboxHabit,
  counter: CounterHabit,
  duration: DurationHabit,
  slider: SliderHabit,
  rating: RatingHabit,
  checknote: CheckNoteHabit,
  shorttext: ShortTextHabit,
  journal: JournalHabit,
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
  archived = false,
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
      className={`habit-row-wrapper${celebrate ? " celebrating" : ""}${archived ? " habit-row-wrapper--archived" : ""}`}
    >
      {archived && <span className="archived-tag">Archived</span>}
      {!archived && streak > 0 && (
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
        archived={archived}
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
