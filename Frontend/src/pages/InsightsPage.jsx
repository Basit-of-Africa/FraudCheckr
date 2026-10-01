
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { BarChart3, Briefcase, Scale, TrendingUp } from "lucide-react";
import { getApiBaseUrl } from "../lib/api";

const InsightsPage = ({ isDark }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    if (!API_URL) {
      setError("API endpoint is not configured. Set VITE_API_URL to your backend tunnel URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/stats`)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch stats. Please try again later.");
        console.error("API Error:", err);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <Loader isDark={isDark} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <EmptyState message={error} isDark={isDark} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors py-20 px-4 ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Conviction Intelligence
          </h1>
          <p className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Deep dive into Nigeria's fraud conviction data and trends
          </p>
        </div>

        {/* Main Stats Grid */}
        {stats && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Total Cases */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20" : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-blue-600/10" : "bg-blue-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                    <Scale className={`w-7 h-7 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total Convictions</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.total_cases}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Verified cases</p>
                </div>
              </div>

              {/* Unique Offenses */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20" : "bg-white border-gray-200 hover:border-purple-400 hover:shadow-md hover:shadow-purple-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-purple-600/10" : "bg-purple-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                    <Briefcase className={`w-7 h-7 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Offense Types</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.unique_offenses}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Distinct charges</p>
                </div>
              </div>

              {/* Unique Courts */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20" : "bg-white border-gray-200 hover:border-green-400 hover:shadow-md hover:shadow-green-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-green-600/10" : "bg-green-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-green-500/20" : "bg-green-100"}`}>
                    <BarChart3 className={`w-7 h-7 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Federal Courts</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.unique_courts}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Jurisdictions</p>
                </div>
              </div>

              {/* Average Sentence */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/20" : "bg-white border-gray-200 hover:border-orange-400 hover:shadow-md hover:shadow-orange-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-orange-600/10" : "bg-orange-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-orange-500/20" : "bg-orange-100"}`}>
                    <TrendingUp className={`w-7 h-7 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Avg Sentence</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.average_prison_term_months
                      ? Math.round(stats.average_prison_term_months / 12)
                      : "N/A"}{" "}
                    <span className="text-xl">yrs</span>
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Average prison term</p>
                </div>
              </div>
            </div>

            {/* Most Common Offense */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mb-16">
              <h2 className="text-2xl font-bold text-white mb-6">
                Most Common Offense
              </h2>
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
                  <span className="text-4xl">⚖️</span>
                </div>
                <div>
                  <p className={`mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Leading Charge Type</p>
                  <p className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.most_common_offense}
                  </p>
                  <p className={`mt-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                    Most frequently prosecuted offense in fraud records
                  </p>
                </div>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-8 rounded-2xl border ${isDark ? "bg-blue-900/20 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Conviction Coverage
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Our database contains comprehensive conviction records spanning multiple years, covering fraud cases processed through various federal courts across Nigeria.
                </p>
                <div className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {stats.total_cases} verified records
                </div>
              </div>

              <div className={`p-8 rounded-2xl border ${isDark ? "bg-purple-900/20 border-purple-700/30" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Offense Diversity
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Convictions span {stats.unique_offenses} different offense types,
                  from cyber crimes to embezzlement. The variation shows the wide
                  scope of federal fraud prosecution activities.
                </p>
                <div className={`font-semibold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {stats.unique_offenses} distinct offense types
                </div>
              </div>

              <div className={`p-8 rounded-2xl border ${isDark ? "bg-green-900/20 border-green-700/30" : "bg-green-50 border-green-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Jurisdictional Spread
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Cases are distributed across {stats.unique_courts} Federal High
                  Courts nationwide, reflecting federal prosecution activities throughout Nigeria's
                  federal judicial system.
                </p>
                <div className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                  {stats.unique_courts} federal courts involved
                </div>
              </div>

              <div className={`p-8 rounded-2xl border ${isDark ? "bg-orange-900/20 border-orange-700/30" : "bg-orange-50 border-orange-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Sentencing Patterns
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  The average prison sentence reflects the seriousness with which
                  fraud crimes are prosecuted, indicating substantial custodial
                  penalties for convicted offenders.
                </p>
                <div className={`font-semibold ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                  {stats.average_prison_term_months
                    ? Math.round(stats.average_prison_term_months / 12)
                    : "N/A"}{" "}
                  years average
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
