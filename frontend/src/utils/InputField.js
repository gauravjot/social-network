import React from "react";

const InputField = ({ label, onChange, type, name, placeholder }) => {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input className="form-control" type={type} placeholder={placeholder} name={name} onChange={onChange} />
    </div>
  );
};

export default InputField;