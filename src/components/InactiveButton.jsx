import React from "react";

const ActiveButton = ({
  title,
  icon,
 onclick,
}) => {
  return (
         <button onClick={onclick} className="w-full px-4 py-2 bg-[#e8f5f0] text-[#1C7D5A] font-bold rounded-[8px] hover:bg-[#d8efe5] transition-colors cursor-pointer flex items-center justify-center gap-2">{icon && icon} { title}</button>
  );
};

export default ActiveButton;