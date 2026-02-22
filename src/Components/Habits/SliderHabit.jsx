import "../../Style/HabitTypes.css";

export default function SliderHabit({
  key,
  name,
  value = 5,
  target,
  sliderMin = 1,
  colorLow = "#ff6b6b",
  colorMid = "#ffd966",
  colorHigh = "#51cf66",
  hasTags,
  tag,
  availableTags,
  onValueChange,
  onTagChange,
  onEdit,
}) {
  const habitInfo = {
    key,
    name,
    habitType : "slider",
    target,
    sliderMin,
    colorLow,
    colorMid,
    colorHigh,
    hasTags,
    availableTags,
  };
  const min = sliderMin || 1;
  const max = target || 10;

  const getThumbColor = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 33) return colorLow;
    if (percentage < 66) return colorMid;
    return colorHigh;
  };

  const getGradient = () => {
    return `linear-gradient(to right, ${colorLow}, ${colorMid}, ${colorHigh})`;
  };

  return (
    <div className="habit-container">
      <span className="habit-name">{name}</span>
      <div className="habit-controls">
        <button className="btn-edit" onClick={() => onEdit(habitInfo)}>
          Edit
        </button>
        {hasTags && availableTags && availableTags.length > 0 && (
          <select
            value={tag || ""}
            onChange={(e) => onTagChange(e.target.value)}
            className="habit-tag-select"
          >
            <option value="">Select tag...</option>
            {availableTags.map((availableTag) => (
              <option key={availableTag} value={availableTag}>
                {availableTag}
              </option>
            ))}
          </select>
        )}

        <div className="slider-container">
          <span className="slider-label">{min}</span>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value))}
            className="slider-slider"
            style={{
              "--thumb-color": getThumbColor(),
              background: getGradient(),
            }}
          />
          <span className="slider-label">{max}</span>
          <span className="slider-value">{value}</span>
        </div>
      </div>
    </div>
  );
}
