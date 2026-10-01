
import React from "react";

const StatCard = ({ title, value, isDark }) => {
  return (
    <div className={`rounded-lg p-6 text-center border transition-all duration-200 ${
      isDark
        ? "bg-slate-800/50 border-slate-700"
        : "bg-white border-gray-200"
    }`}>
      <p className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
        {title}
      </p>
      <p className="text-4xl md:text-5xl font-bold text-blue-600">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
