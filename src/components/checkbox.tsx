import React from 'react';

export interface CheckBoxProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  onValueChange: (checked: boolean) => void;
}

const CheckBox = (props: CheckBoxProps): React.ReactElement => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.checked;
    props.onValueChange(value);
  };

  let classes = 'checkbox';
  if (props.disabled) {
    classes += ' disabled';
  }
  return (
    <div className={classes}>
      <input type="checkbox" disabled={props.disabled} checked={props.checked} onChange={onInputChange}></input>
      <span>{props.label}</span>
    </div>
  );
};

export default CheckBox;
