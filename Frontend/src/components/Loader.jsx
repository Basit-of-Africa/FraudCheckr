
import React from "react";

const Loader = ({ isDark = true }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-spin"></div>
        <div className={`absolute inset-2 rounded-full ${isDark ? "bg-gray-900" : "bg-white"}`}></div>
      </div>
      <p className={`mt-6 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading records...</p>
    </div>
  );
};

export default Loader;
