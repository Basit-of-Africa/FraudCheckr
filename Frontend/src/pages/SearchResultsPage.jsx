
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getApiBaseUrl } from "../lib/api";

const SearchResultsPage = ({ isDark }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("name");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    if (query) {
      if (!API_URL) {
        setError("API endpoint is not configured. Set VITE_API_URL to your backend tunnel URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      axios
        .get(`${API_URL}/search?name=${query}`)
        .then((response) => {
          setResults(response.data.data); // Extract the data array from paginated response
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch results. Please try again later.");
          console.error("API Error:", err);
          setLoading(false);
        });
    }
  }, [API_URL, query]);

  return (
    <div className={`min-h-screen transition-colors py-12 px-4 ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Search Results{query && ` for "${query}"`}
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            {loading ? "Searching..." : `Found ${results.length} record${results.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar initialValue={query} isDark={isDark} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader isDark={isDark} />
            </div>
          ) : error ? (
            <EmptyState message={error} isDark={isDark} />
          ) : results.length > 0 ? (
            <>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-6`}>
                Showing {results.length} matching record{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((result, index) => (
                <ResultCard key={index} result={result} isDark={isDark} />
              ))}
            </>
          ) : (
            <>
              <EmptyState message={`No records found for "${query}". Try a different search.`} isDark={isDark} />
              <div className={`border rounded-lg p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Search Tips:</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li>• Try searching with just a first name or last name</li>
                  <li>• Search is case-insensitive</li>
                  <li>• Partial matches are supported</li>
                  <li>• Visit the <a href="/insights" className={`${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>Insights</a> page to explore conviction statistics</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
