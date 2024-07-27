/* eslint-disable react/prop-types */
import "./Dropdown.style.css";

export const Dropdown = ({
  label,
  disabled = false,
  hidden = false,
  options,
  register,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="custom-dropdown" style={hidden ? {display: "none"}: {}}>
      <label className="form-label">{label}</label>
      <select
        className="form-select form-select-lg my-3"
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...register(name)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
