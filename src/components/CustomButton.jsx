import React from "react";

const CustomButton = ({
  bg = "bg-green-100",
  textColor = "text-green-700",
  hoverBg = "hover:bg-green-200",
  className = "",
  children,
  title,
  onClick,
  ...props // para otros props como disabled, id, etc.
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        w-[40px]
        h-[40px]
        rounded-full
        transition
        duration-200
        ${bg}
        ${textColor}
        ${hoverBg}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
