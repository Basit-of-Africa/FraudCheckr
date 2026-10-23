
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { FACTS } from "../lib/facts";

const SearchBar = ({ initialValue = "", isDark = false }) => {
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?name=${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className={`relative flex items-center gap-4 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
          focused
            ? isDark
              ? "bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10"
              : "bg-white border-blue-500 shadow-lg shadow-blue-500/10"
            : isDark
            ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
            : "bg-gray-50 border-gray-200 hover:border-gray-300"
        }`}>
          <Search className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
            focused
              ? isDark ? "text-blue-400" : "text-blue-600"
              : isDark ? "text-gray-500" : "text-gray-400"
          }`} />
          
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search by defendant name..."
            className={`flex-1 bg-transparent text-base focus:outline-none transition-colors duration-200 placeholder-gray-500 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          />
          
          <button
            type="submit"
            disabled={!query.trim()}
            className={`inline-flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-lg transition-all duration-200 flex-shrink-0 ${
              query.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            Search
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className={`text-center text-xs mt-3 transition-colors duration-200 ${
        isDark ? "text-gray-500" : "text-gray-500"
      }`}>
        Search {FACTS.recordsLabel} conviction records published by the EFCC
      </p>
    </form>
  );
};

export default SearchBar;
