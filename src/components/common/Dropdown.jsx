import React, { useState, useEffect } from 'react';
import * as Icons from "react-icons/tb";

const Dropdown = ({ 
  className, 
  placeholder, 
  onClick, 
  options, 
  selectedValue, 
  icon, 
  label, 
  valid, 
  required, 
  name 
}) => {
  const [dropdown, setDropdown] = useState(false);

  const handleOptionClick = (option) => {
    if (onClick) {
      onClick(option);
    }
    setDropdown(false);
  };

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdown && e.target.closest('.dropdown') === null) {
        setDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [dropdown]);

  return (
    <div className={`input_field ${className ? className : ""}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input_field_wrapper">
        {icon && <label htmlFor={name} className="input_icon">{icon}</label>}
        <div className={`dropdown ${className ? className : ""}`}>
          <span 
            onClick={handleDropdown} 
            className="dropdown_placeholder" 
            aria-haspopup="listbox" 
            aria-expanded={dropdown}
          >
            {selectedValue || placeholder}
            <Icons.TbChevronDown />
          </span>
          <ul 
            className={`dropdown_options ${dropdown ? "active" : ""}`} 
            role="listbox"
          >
            {options.map((option, key) => (
              <li 
                key={key} 
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={option.label === selectedValue}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {valid && <small>{valid}</small>}
    </div>
  );
};

export default Dropdown;
