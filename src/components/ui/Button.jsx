import React from "react";
import classNames from "../../utils/classNames";

const VARIANTS = {
  primary: "bg-brand text-gray-1 border border-gray-1/80",
  secondary: "bg-gray-1/30 text-gray-1",
  bare: "",
};

const LABELED_SIZES = {
  lg: "gap-[calc(6/1728*var(--vw))] px-[calc(28/1728*var(--vw))] py-[calc(16/1728*var(--vw))] font-medium text-xl",
  md: "gap-[calc(6/1728*var(--vw))] px-[calc(20/1728*var(--vw))] py-[calc(12/1728*var(--vw))] font-medium text-xl",
};

const Button = React.forwardRef(
  (
    {
      variant = "secondary",
      size = "md",
      iconOnly = false,
      boxSize,
      startIcon,
      children,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      "flex items-center justify-center rounded-full font-primary cursor-pointer",
      VARIANTS[variant],
      iconOnly
        ? boxSize != null && `size-[calc(${boxSize}/1728*var(--vw))]`
        : LABELED_SIZES[size],
      className
    );

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {iconOnly ? (
          children
        ) : (
          <>
            {startIcon}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
