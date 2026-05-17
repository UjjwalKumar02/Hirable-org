interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  const defaultStyles =
    "cursor-pointer font-medium disabled:bg-gray-100 disabled:cursor-default";

  const variantStyles = {
    primary: "bg-black text-gray-100",
    secondary: "bg-white text-gray-800 border border-gray-200",
  };

  const sizeStyles = {
    sm: "",
    md: "rounded-xl py-1.5 px-3 text-sm",
    lg: "",
  };

  return (
    <button
      onClick={props.onClick}
      className={` ${props.className} ${variantStyles[props.variant]} ${sizeStyles[props.size]} ${defaultStyles}`}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? "Loading..." : props.children}
    </button>
  );
}
