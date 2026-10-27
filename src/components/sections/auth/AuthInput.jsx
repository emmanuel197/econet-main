import React from "react";
import classNames from "../../../utils/classNames";

// Scales on the 390 mobile comp (--mvw) below md, 1728 (--vw) at md+ — without
// the mobile basis the padding/text floored at --vw's 768px and rendered tiny.
const AuthInput = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={classNames(
      "w-full rounded-full border border-gray-1/15 bg-gray-1/10 text-gray-1 placeholder:text-gray-6 outline-none focus:border-brand",
      "px-[calc(20/390*var(--mvw))] py-[calc(13/390*var(--mvw))] text-[calc(15/390*var(--mvw))]",
      "md:px-[calc(24/1728*var(--vw))] md:py-[calc(14/1728*var(--vw))] md:text-lg",
      className
    )}
    {...props}
  />
));

AuthInput.displayName = "AuthInput";
export default AuthInput;
