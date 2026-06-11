export interface DropdownProps {
  label: string;
  options: string[];
  reference?: React.RefObject<HTMLSelectElement | null>;
  className?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  defaultValue?: string;
  required?: boolean;
  selectOption?: boolean;
}
export default function Dropdown({
  label,
  options,
  reference,
  className,
  disabled,
  onChange,
  defaultValue,
  required,
  selectOption,
}: DropdownProps) {
  const defaultStyles =
    "outline-none text-sm py-2 px-3 rounded-xl border border-gray-200";

  return (
    <div className="flex flex-col ">
      <label>{label}</label>
      <select
        ref={reference}
        id={label}
        className={`${className} ${defaultStyles}`}
        onChange={onChange}
        defaultValue={defaultValue}
        required={required}
      >
        {selectOption && <option value="">Select</option>}
        {options.map((o, index) => (
          <option key={index} value={o} disabled={disabled}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
