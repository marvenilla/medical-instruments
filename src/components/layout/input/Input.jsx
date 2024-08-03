/* eslint-disable react/prop-types */
import "./Input.style.css";

export const Input = ({
  label,
  placeholder,
  value,
  register,
  required = false,
  onChange,
  type = "text",
  name = "",
  disabled = false,
  className = "",
}) => {
  return (
    <div className="custom-input my-3 w-100">
      <label className="form-label custom-label">{label}</label>
      {register ? (
        <input
          disabled={disabled}
          type={type}
          name={name}
          className={"form-control form-control-lg" + className}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...register(name, { required })}
        />
      ) : (
        <input
          disabled={disabled}
          type={type}
          name={name}
          className="form-control form-control-lg"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
