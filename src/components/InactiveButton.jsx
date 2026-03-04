import React from "react";

const ActiveButton = ({
  title,
  icon,
 onclick,
}) => {
  return (
         <button className="w-full px-4 py-2 bg-[#e6f4ef]  rounded-[8px]">{icon && icon} { title}</button>
  );
};

export default ActiveButton;