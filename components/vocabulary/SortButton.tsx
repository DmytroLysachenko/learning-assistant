import type { SortDirection, SortField } from "@/types";

interface SortButtonProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: () => void;
}

const SortButton = ({
  field,
  currentField,
  direction,
  onClick,
}: SortButtonProps) => {
  const isActive = currentField === field;
  const label = field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md ${
        isActive
          ? "bg-purple-100 text-purple-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label} {isActive && (direction === "asc" ? "↑" : "↓")}
    </button>
  );
};

export default SortButton;
