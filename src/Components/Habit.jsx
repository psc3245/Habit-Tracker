import CheckboxHabit from "./Habits/CheckboxHabit.jsx";

// Registry of all available habit types
const HABIT_TYPE_COMPONENTS = {
  "checkbox": CheckboxHabit,
  // "counter": CounterHabit,
  // "timer": TimerHabit,
  // Add new types here
};

export default function Habit({ 
  name, 
  completed, 
  type, 
  tag, 
  availableTags, 
  onToggle, 
  onTagChange,
  // Future props for other habit types
  value,
  onValueChange,
  ...otherProps 
}) {
  // Get the component for this habit type
  const HabitComponent = HABIT_TYPE_COMPONENTS[type] || HABIT_TYPE_COMPONENTS["checkbox"];
  
  // Pass all relevant props to the component
  return (
    <HabitComponent
      name={name}
      completed={completed}
      tag={tag}
      availableTags={availableTags}
      onToggle={onToggle}
      onTagChange={onTagChange}
      value={value}
      onValueChange={onValueChange}
      {...otherProps}
    />
  );
}