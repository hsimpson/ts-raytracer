import React from 'react';

export interface CheckBoxProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  onValueChange: (checked: boolean) => void;
}

const CheckBox = ({ label, checked, disabled, onValueChange }: CheckBoxProps): React.ReactElement => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.checked;
    onValueChange(value);
  };

  let classes = 'checkbox';
  if (disabled) {
    classes += ' disabled';
  }
  return (
    <div className={classes}>
      <input type="checkbox" disabled={disabled} checked={checked} onChange={onInputChange} />
      <span>{label}</span>
    </div>
  );
};

export default CheckBox;
