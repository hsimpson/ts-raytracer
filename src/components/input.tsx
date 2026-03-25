import React from 'react';

export interface InputProps {
  label: string;
  size: number;
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
}

const NumberInput = ({ label, size, value, min, max, onValueChange }: InputProps): React.ReactElement => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    if (!Number.isNaN(newValue)) {
      onValueChange(newValue);
    }
  };

  return (
    <div className="input">
      <label>{label}</label>
      <input type="number" size={size} min={min} max={max} value={value} onChange={onInputChange} />
    </div>
  );
};

export default NumberInput;
