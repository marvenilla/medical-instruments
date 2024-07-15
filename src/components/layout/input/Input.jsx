/* eslint-disable react/prop-types */
import "./Input.style.css"

export const Input = ({label, placeholder, value, onChange, type = "text"}) => {
  return (
    <div className="custom-input">
      <label className="form-label custom-label">{label}</label>
      <input
        type={type}
        className="form-control form-control-lg"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};