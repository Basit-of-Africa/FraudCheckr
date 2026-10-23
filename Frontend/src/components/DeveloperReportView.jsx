import React from "react";

const DeveloperReportView = ({ isDark, report, loading = false }) => {
  const mutedClass = isDark ? "text-slate-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";

  if (loading) {
    return <p className={`mt-4 ${mutedClass}`}>Loading report...</p>;
  }

  if (!report) {
    return <p className={`mt-4 ${mutedClass}`}>Run or select a screening report to inspect its details.</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <p className={`text-sm ${mutedClass}`}>Status</p>
        <p className={`text-xl font-semibold ${headingClass}`}>{report.status}</p>
      </div>
      <div>
        <p className={`text-sm ${mutedClass}`}>Summary</p>
        <p className={`${mutedClass}`}>{report.summary_text}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-2xl border p-3 ${isDark ? "border-slate-800" : "border-gray-200"}`}>
          <p className={`text-xs ${mutedClass}`}>Confidence</p>
          <p className={`text-lg font-semibold ${headingClass}`}>{report.confidence}</p>
        </div>
        <div className={`rounded-2xl border p-3 ${isDark ? "border-slate-800" : "border-gray-200"}`}>
          <p className={`text-xs ${mutedClass}`}>Exact</p>
          <p className={`text-lg font-semibold ${headingClass}`}>{report.summary.exact_matches}</p>
        </div>
        <div className={`rounded-2xl border p-3 ${isDark ? "border-slate-800" : "border-gray-200"}`}>
          <p className={`text-xs ${mutedClass}`}>Total</p>
          <p className={`text-lg font-semibold ${headingClass}`}>{report.summary.total_matches}</p>
        </div>
      </div>
      <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-800 bg-slate-950" : "border-gray-200 bg-gray-50"}`}>
        <p className={`text-sm ${mutedClass}`}>Report ID</p>
        <p className={`font-mono text-sm mt-1 ${headingClass}`}>{report.report_id}</p>
        <p className={`text-sm mt-3 ${mutedClass}`}>Reference: {report.query.reference || "None provided"}</p>
        <p className={`text-sm mt-2 ${mutedClass}`}>Generated: {report.audit.created_at}</p>
        <p className={`text-sm mt-2 ${mutedClass}`}>Dataset: {report.audit.dataset_version}</p>
        <p className={`text-sm mt-2 ${mutedClass}`}>Source: {report.audit.source}</p>
      </div>
      <div className="space-y-3">
        {report.matches.map((match, index) => (
          <div key={`${report.report_id}-${index}`} className={`rounded-2xl border p-4 ${isDark ? "border-slate-800" : "border-gray-200"}`}>
            <div className="flex justify-between gap-4">
              <div>
                <p className={`font-semibold ${headingClass}`}>{match.record.name}</p>
                <p className={`text-sm ${mutedClass}`}>{match.record.offense}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${mutedClass}`}>{match.match_type}</p>
                <p className={`font-semibold ${headingClass}`}>{match.confidence}</p>
              </div>
            </div>
            <p className={`mt-3 text-sm ${mutedClass}`}>{match.reason}</p>
            <p className={`mt-2 text-xs ${mutedClass}`}>
              {[
                match.record.record_id,
                match.record.charge_number && `Charge ${match.record.charge_number}`,
                match.record.court,
                match.record.date_of_conviction,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperReportView;
