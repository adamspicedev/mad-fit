import React from "react";

const Separator = ({ text }: { text?: string }) => {
  return (
    <div className="w-full flex items-center justify-center gap-2">
      <span className="border-b border-gray-300 w-full"></span>
      <span className="flex-none">{text}</span>
      <span className="border-b border-gray-300 w-full"></span>
    </div>
  );
};

export default Separator;
