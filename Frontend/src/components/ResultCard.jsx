
import React from "react";
import { Scale, Briefcase, Building2, DollarSign } from "lucide-react";

const ResultCard = ({ result, isDark }) => {
  return (
    <div className={`group border rounded-lg p-6 mb-3 transition-all duration-200 hover:-translate-y-1 ${
      isDark
        ? "bg-slate-800/50 border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
        : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
    }`}>
      {/* Defendant Name */}
      <div className="mb-5">
        <h3 className={`text-xl font-semibold transition-colors duration-200 ${
          isDark ? "text-white group-hover:text-blue-300" : "text-gray-900 group-hover:text-blue-600"
        }`}>
          {result.name}
        </h3>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Offense */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}>
            Offense
          </p>
          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {result.offense}
          </p>
        </div>

        {/* Court */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}>
            Court
          </p>
          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {result.court}
          </p>
        </div>

        {/* Prison Term */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}>
            Prison Term
          </p>
          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {result.prison_term}
          </p>
          {result.prison_term_months && (
            <p className={`text-xs mt-1.5 ${isDark ? "text-gray-600" : "text-gray-500"}`}>
              ({result.prison_term_months} months)
            </p>
          )}
        </div>

        {/* Fine/Restitution */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Penalties
            </p>
          </div>
          <div className="space-y-1">
            {result.fine && (
              <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Fine:</span> ₦{Number(result.fine).toLocaleString("en-NG")}
              </p>
            )}
            {result.restitution && (
              <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Restitution:</span>{" "}
                {/* Restitution carries its own currency, e.g. "USD 4,000" or "NGN 250,000" */}
                {String(result.restitution).replace(/\bNGN /g, "₦")}
              </p>
            )}
            {!result.fine && !result.restitution && (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>No fine or restitution recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className={`mt-6 pt-6 border-t flex items-center justify-between ${isDark ? "border-slate-700" : "border-gray-200"}`}>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
          Conviction Record
        </span>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          Case Record
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
