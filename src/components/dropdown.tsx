import React from 'react';

export interface DropDownItem {
  text: string;
  value: number;
}

export interface DropDownProps {
  items: DropDownItem[];
  label: string;
  disabled: boolean;
  default: number;
  onValueChange: (value: number) => void;
}

export const DropDown = (props: DropDownProps): React.ReactElement => {
  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    props.onValueChange(parseInt(value));
  };

  return (
    <div className="dropdown">
      <span>{props.label}</span>
      <select disabled={props.disabled} defaultValue={props.default} onChange={onSelectChange}>
        {props.items.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          );
        })}
      </select>
    </div>
  );
};
