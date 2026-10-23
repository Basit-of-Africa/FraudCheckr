
import React from "react";
import { Scale, Briefcase, Building2, DollarSign } from "lucide-react";

// Flags a reader should see next to the record (see data/README.md for all flags)
const READER_NOTES = {
  sentence_mentions_acquittal_or_discharge:
    "The EFCC lists this as a conviction, but the sentence text mentions an acquittal or discharge. Treat with caution.",
  possible_duplicate: "This case appears more than once in the EFCC tables with different details.",
  court_inferred_from_charge_number: "The court was not recorded; it was worked out from the charge number.",
  conviction_date_day_month_corrected: "The date was corrected for a day/month mix-up in the source.",
  date_order_uncertain: "The day and month of the date may be reversed in the source.",
  single_word_name: "Only one name was recorded, which makes this record hard to tie to a person.",
  sentence_names_specific_defendants:
    "This case had several defendants and the outcome may differ between them. Read the sentence to see which defendants it applies to.",
};

const ResultCard = ({ result, isDark }) => {
  const muted = isDark ? "text-gray-400" : "text-gray-600";
  // A reviewed record's editor note replaces the automatic outcome warnings.
  const REVIEWED = ["sentence_mentions_acquittal_or_discharge", "sentence_names_specific_defendants"];
  const notes = (result.quality_flags || []).filter(
    (f) => READER_NOTES[f] && !(result.editor_note && REVIEWED.includes(f))
  );
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
        {result.aliases && <p className={`text-sm mt-1 ${muted}`}>Also recorded as: {result.aliases}</p>}
        {result.co_defendants && <p className={`text-sm mt-1 ${muted}`}>Co-defendants: {result.co_defendants}</p>}
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Offense */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}>
            Offence
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
            Custodial term
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

      {/* Identifiers for checking the record with the court */}
      <dl className={`mt-5 grid sm:grid-cols-3 gap-3 text-sm ${muted}`}>
        <div>
          <dt className="text-xs uppercase tracking-wider">Charge number</dt>
          <dd className={isDark ? "text-white" : "text-gray-900"}>{result.charge_number || "Not recorded"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider">Date of conviction</dt>
          <dd className={isDark ? "text-white" : "text-gray-900"}>{result.date_of_conviction || "Not recorded"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider">Judge</dt>
          <dd className={isDark ? "text-white" : "text-gray-900"}>{result.judge || "Not recorded"}</dd>
        </div>
      </dl>

      {result.sentence && (
        <details className={`mt-4 text-sm ${muted}`}>
          <summary className="cursor-pointer">Sentence as recorded by the EFCC</summary>
          <p className="mt-2">{result.sentence}</p>
        </details>
      )}

      {result.editor_note && (
        <p className={`mt-4 rounded-lg border p-3 text-sm ${isDark ? "bg-blue-900/20 border-blue-700/40 text-blue-200" : "bg-blue-50 border-blue-200 text-blue-900"}`}>
          <strong>FraudCheckr note:</strong> {result.editor_note}
        </p>
      )}

      {notes.length > 0 && (
        <ul className={`mt-4 rounded-lg border p-3 text-sm space-y-1 ${isDark ? "bg-amber-900/20 border-amber-700/40 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
          {notes.map((f) => (
            <li key={f}>{READER_NOTES[f]}</li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t flex flex-wrap gap-2 items-center justify-between text-xs ${isDark ? "border-slate-700" : "border-gray-200"} ${muted}`}>
        <span>
          {result.record_id ? `Record ${result.record_id}` : "Conviction record"}
          {result.source_table && ` · ${result.source_table}, row ${result.source_serial}`}
        </span>
        <span>Confirm with the court registry before relying on this record.</span>
      </div>
    </div>
  );
};

export default ResultCard;
