import React from 'react';

export interface DropDownItem {
  text: string;
  value: number;
  disabled: boolean;
}

export interface DropDownProps {
  items: DropDownItem[];
  label: string;
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
      <select defaultValue={props.default} onChange={onSelectChange}>
        {props.items.map((item) => {
          return (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.text}
            </option>
          );
        })}
      </select>
    </div>
  );
};
