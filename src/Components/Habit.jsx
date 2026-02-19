import CheckboxHabit from "./Habits/CheckboxHabit.jsx";
import CounterHabit from "./Habits/CounterHabit.jsx";
import DurationHabit from "./Habits/DurationHabit.jsx";
import SliderHabit from "./Habits/SliderHabit.jsx";

// Registry of all available habit types
const HABIT_TYPE_COMPONENTS = {
  checkbox: CheckboxHabit,
  counter: CounterHabit,
  duration: DurationHabit,
  slider: SliderHabit,
  // "counter": CounterHabit,
  // "timer": TimerHabit,
  // Add new types here
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
  ...otherProps
}) {
  // Get the component for this habit type
  const HabitComponent =
    HABIT_TYPE_COMPONENTS[type];

  // Pass all relevant props to the component
  return (
    <HabitComponent
      name={name}
      completed={completed}
      hasTags={hasTags}
      tag={tag}
      target = {target}
      availableTags={availableTags}
      onToggle={onToggle}
      onTagChange={onTagChange}
      value={value}
      onValueChange={onValueChange}
      sliderMin={sliderMin}
      colorLow={colorLow}
      colorMid={colorMid}
      colorHigh={colorHigh}
      {...otherProps}
    />
  );
}
