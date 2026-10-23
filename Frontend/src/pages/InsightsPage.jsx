
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { BarChart3, Briefcase, Scale, TrendingUp } from "lucide-react";
import { getApiBaseUrl } from "../lib/api";
import { FACTS } from "../lib/facts";

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
            Patterns across {FACTS.recordsLabel} convictions reported by the EFCC for {FACTS.yearsLabel}
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
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Conviction records</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.total_cases}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>One per defendant, as reported by the EFCC</p>
                </div>
              </div>

              {/* Unique Offenses */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20" : "bg-white border-gray-200 hover:border-purple-400 hover:shadow-md hover:shadow-purple-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-purple-600/10" : "bg-purple-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                    <Briefcase className={`w-7 h-7 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Offence categories</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.unique_offenses}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Spelling variants grouped</p>
                </div>
              </div>

              {/* Unique Courts */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20" : "bg-white border-gray-200 hover:border-green-400 hover:shadow-md hover:shadow-green-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-green-600/10" : "bg-green-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-green-500/20" : "bg-green-100"}`}>
                    <BarChart3 className={`w-7 h-7 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Courts</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.unique_courts}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Federal, State and FCT High Courts</p>
                </div>
              </div>

              {/* Average Sentence */}
              <div className={`group relative p-8 rounded-2xl border transition-all ${isDark ? "bg-slate-800 border-slate-700 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/20" : "bg-white border-gray-200 hover:border-orange-400 hover:shadow-md hover:shadow-orange-400/10"}`}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-orange-600/10" : "bg-orange-100/30"}`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-orange-500/20" : "bg-orange-100"}`}>
                    <TrendingUp className={`w-7 h-7 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Average custodial term</p>
                  <p className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.average_prison_term_months
                      ? Math.round(stats.average_prison_term_months)
                      : "N/A"}{" "}
                    <span className="text-xl">months</span>
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Where a custodial term was imposed; many carried an option of fine</p>
                </div>
              </div>
            </div>

            {/* Most Common Offense */}
            <div className={`p-8 rounded-2xl border mb-16 ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                Most Common Offence
              </h2>
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
                  <span className="text-4xl">⚖️</span>
                </div>
                <div>
                  <p className={`mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Leading offence category</p>
                  <p className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {stats.most_common_offense}
                  </p>
                  <p className={`mt-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                    The offence category with the most convictions in the dataset
                  </p>
                </div>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-8 rounded-2xl border ${isDark ? "bg-blue-900/20 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Coverage
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  The dataset holds every conviction listed in the EFCC's Narrative of Convictions tables for {FACTS.yearsLabel}. It covers convictions the EFCC secured, not every fraud case in Nigeria.
                </p>
                <div className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {stats.total_cases.toLocaleString("en-NG")} records
                </div>
              </div>

              <div className={`p-8 rounded-2xl border ${isDark ? "bg-purple-900/20 border-purple-700/30" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Offences
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Offences recorded in hundreds of different ways are grouped into {stats.unique_offenses} categories,
                  from impersonation and cybercrime to money laundering and illegal oil dealing.
                </p>
                <div className={`font-semibold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {stats.unique_offenses} offence categories
                </div>
              </div>

              <div className={`p-8 rounded-2xl border ${isDark ? "bg-green-900/20 border-green-700/30" : "bg-green-50 border-green-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Jurisdictional Spread
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Convictions came from {stats.unique_courts} identified Federal, State and FCT High Courts
                  in {FACTS.placesLabel}.
                </p>
                <div className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                  {stats.unique_courts} courts
                </div>
              </div>

              <div className={`p-8 rounded-2xl border ${isDark ? "bg-orange-900/20 border-orange-700/30" : "bg-orange-50 border-orange-200"}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Sentencing Patterns
                </h3>
                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  This is the average of the longest custodial term in each sentence that had one.
                  Many sentences also allowed a fine instead of prison, so it is not the time actually served.
                </p>
                <div className={`font-semibold ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                  {stats.average_prison_term_months
                    ? Math.round(stats.average_prison_term_months)
                    : "N/A"}{" "}
                  months average
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
