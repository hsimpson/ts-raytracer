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

export const DropDown = ({ items, label, default: defaultValue, onValueChange }: DropDownProps): React.ReactElement => {
  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    onValueChange(parseInt(value));
  };

  return (
    <div className="dropdown">
      <span>{label}</span>
      <select defaultValue={defaultValue} onChange={onSelectChange}>
        {items.map((item) => {
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
