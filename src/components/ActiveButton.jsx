import React from "react";

const ActiveButton = ({
  title,
  icon,
 onclick,
}) => {
  return (
      <button onClick={onclick} className="w-full px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-[8px] transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold">{icon && icon} { title}</button>
  );
};

export default ActiveButton;