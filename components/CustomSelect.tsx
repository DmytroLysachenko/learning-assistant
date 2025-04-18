import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CustomSelect = ({
  handleValueChange,
  options,
  isDisabled,
  currentValue,
  placeholder,
}: {
  handleValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  currentValue: string;
  isDisabled?: boolean;
  placeholder?: string;
}) => {
  return (
    <Select
      onValueChange={(value) => {
        handleValueChange(value);
      }}
      value={currentValue}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
