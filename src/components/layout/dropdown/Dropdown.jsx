/* eslint-disable react/prop-types */
import './Dropdown.style.css';

export const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="custom-dropdown">
      <label className="form-label">{label}</label>
      <select
        className="form-select form-select-lg"
        value={value}
        onChange={onChange}
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