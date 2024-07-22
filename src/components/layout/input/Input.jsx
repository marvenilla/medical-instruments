/* eslint-disable react/prop-types */
import './Input.style.css';

export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  name = '',
  disabled = false,
}) => {
  return (
    <div className="custom-input my-3 w-100">
      <label className="form-label custom-label">{label}</label>
      <input
        disabled={disabled}
        type={type}
        name={name}
        className="form-control form-control-lg"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
