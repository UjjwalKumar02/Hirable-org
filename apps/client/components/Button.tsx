interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "submit";
}

export default function Button(props: ButtonProps) {
  const defaultStyles =
    "cursor-pointer font-medium disabled:bg-gray-500 disabled:text-white disabled:cursor-default rounded-xl";

  const variantStyles = {
    primary: "bg-black text-gray-100 border",
    secondary: "bg-white text-gray-800 border border-gray-200",
  };

  const sizeStyles = {
    sm: "py-1 px-2 text-sm",
    md: "py-1.5 px-3 text-sm",
    lg: "py-1.5 px-9 text-md",
  };

  return (
    <button
      onClick={props.onClick}
      className={` ${props.className} ${variantStyles[props.variant]} ${sizeStyles[props.size]} ${defaultStyles}`}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? "Loading..." : props.children}
    </button>
  );
}
