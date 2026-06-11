interface TextAreaProps {
  label: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export default function TextArea({
  label,
  className,
  disabled,
  required,
  maxLength,
  onChange,
}: TextAreaProps) {
  const defaultStyles =
    "resize-none outline-none rounded-xl border border-gray-200";
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <textarea
        className={`${className} ${defaultStyles}`}
        readOnly={disabled}
        required={required}
        maxLength={
          maxLength === null || maxLength === undefined || maxLength === 0
            ? 10000
            : 8 * maxLength
        }
        onChange={onChange}
      />
    </div>
  );
}
