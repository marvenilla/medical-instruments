/* eslint-disable react/prop-types */
import { Typeahead } from 'react-bootstrap-typeahead';
// import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './styles.css';
// import { dataExample } from './data';

function filterBy(option, state) {
  if (state.selected.length) {
    return true;
  }
  return option.label.toLowerCase().indexOf(state.text.toLowerCase()) > -1;
}

const ToggleButton = ({ isOpen, onClick }) => (
  <button
    className="toggle-button"
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
export const Autocomplete = ({ label, options, onChange, placeholder = '' }) => {
  const formatOptions = options.map((option) => ({
    ...option,
    label: `${option.name} - Units: ${option.stock}`,
  }));
  return (
    <div className="custom-autocomplete">
      <label className="form-label">{label}</label>
      <Typeahead
        filterBy={filterBy}
        id="field-autocomplete"
        onChange={onChange}
        className="field-autocomplete"
        options={formatOptions}
        placeholder={placeholder}
      >
        {({ isMenuShown, toggleMenu }) => (
          <ToggleButton isOpen={isMenuShown} onClick={() => toggleMenu()} />
        )}
      </Typeahead>
    </div>
  );
};
