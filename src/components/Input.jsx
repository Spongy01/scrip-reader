import React from 'react';

const Input = ({ value, onChange, placeholder, name }) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    //   className="custom-input"
      style={inputStyle}
    />
  );
};

const inputStyle = {
  padding: '8px',
  margin: '4px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

export default Input;