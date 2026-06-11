interface InputProps {
  size: "sm" | "md" | "lg";
  type: "text" | "number" | "email" | "password" | "boolean";
  title?: string;
  placeholder?: string;
  className?: string;
  reference?: React.Ref<HTMLInputElement>;
  defaultValue?: string;
  readonly?: boolean;
  required?: boolean;
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Input(props: InputProps) {
  const sizeStyles = {
    sm: "",
    md: "min-w-68",
    lg: "",
  };

  const defaultStyles =
    "outline-none border border-gray-200 rounded-lg py-1 px-2";

  return (
    <div
      className={`${props.className} flex flex-col ${sizeStyles[props.size]}`}
    >
      <label>{props.title}</label>
      <input
        ref={props.reference}
        type={props.type}
        placeholder={props.placeholder}
        className={defaultStyles}
        readOnly={props.readonly}
        defaultValue={props.defaultValue}
        required={props.required}
        maxLength={
          props.maxLength === null ||
          props.maxLength === undefined ||
          props.maxLength === 0
            ? 10000
            : props.maxLength
        }
        onChange={props.onChange}
      />
    </div>
  );
}
