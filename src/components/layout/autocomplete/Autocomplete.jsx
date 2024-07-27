/* eslint-disable react/prop-types */
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './styles.css';

function filterBy(option, state) {
  if (state.selected.length) {
    return true;
  }
  return option.label.toLowerCase().indexOf(state.text.toLowerCase()) > -1;
}

const ToggleButton = ({ isOpen, onClick }) => (
  <button
    className="toggle-button"
    type='button'
    onClick={onClick}
    onMouseDown={(e) => {
      // Prevent input from losing focus.
      e.preventDefault();
    }}
  >
    {isOpen ? '▲' : '▼'}
  </button>
);

// eslint-disable-next-line no-unused-vars
export const Autocomplete = ({ label, options,multiple, onChange, placeholder = '' }) => {
  return (
    <div className="custom-autocomplete">
      <label className="form-label">{label}</label>
      <Typeahead
        multiple={multiple}
        filterBy={filterBy}
        id="field-autocomplete"
        onChange={onChange}
        className="field-autocomplete"
        options={options}
        placeholder={placeholder}
      >
        {({ isMenuShown, toggleMenu }) => (
          <ToggleButton isOpen={isMenuShown} onClick={() => toggleMenu()} />
        )}
      </Typeahead>
    </div>
  );
};
