interface InputProps {
  size: "sm" | "md" | "lg";
  type: "text" | "number" | "email" | "password" | "boolean";
  title?: string;
  placeholder?: string;
  className?: string;
  reference?: React.Ref<HTMLInputElement>;
  maxLength?: number;
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
      <label htmlFor="">{props.title}</label>
      <input
        ref={props.reference}
        type={props.type}
        placeholder={props.placeholder}
        className={defaultStyles}
        maxLength={props.maxLength}
      />
    </div>
  );
}
