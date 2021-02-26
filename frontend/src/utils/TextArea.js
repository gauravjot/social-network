import React from "react";

const TextArea = ({ label, onChange, type, name, placeholder, value }) => {
  return (
    <div>
        <label className="form-label">{label}</label>
        <textarea className="form-control" type={type} placeholder={placeholder} name={name} onChange={onChange} value={value}/>
    </div>
  );
};

export default TextArea;