import React from "react";
import { AlertTriangle, Shield, Info } from "lucide-react";

const DisclaimerPage = ({ isDark }) => {
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const bgClass = isDark ? "bg-slate-800" : "bg-gray-50";
  const borderClass = isDark ? "border-slate-700" : "border-gray-200";

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h1 className={`text-4xl md:text-5xl font-bold ${headingClass}`}>
              Disclaimer
            </h1>
          </div>
          <p className={`text-lg ${textSecondaryClass}`}>
            Important Legal Information
          </p>
        </div>

        {/* Critical Warning */}
        <div className={`p-6 rounded-lg border-2 border-red-500 ${isDark ? "bg-red-500/10" : "bg-red-50"} mb-8`}>
          <h2 className={`text-2xl font-bold text-red-600 mb-3 flex items-center gap-2`}>
            <AlertTriangle className="w-6 h-6" />
            General Disclaimer
          </h2>
          <p className={`${textSecondaryClass} font-semibold`}>
            The information provided by FraudCheckr is for informational purposes only. While we strive to provide accurate and up-to-date information, we make no warranties or representations about the accuracy, completeness, or reliability of any information on this site.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* No Legal Advice */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <Info className="w-6 h-6 text-blue-500" />
              1. Not Legal Advice
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              FraudCheckr is not a law firm, and nothing on this site constitutes legal advice. Information provided about fraud convictions is for research and informational purposes only.
            </p>
            <p className={textSecondaryClass}>
              If you need legal advice, please consult with a qualified attorney. Do not rely solely on information from FraudCheckr for legal decisions or actions.
            </p>
          </section>

          {/* Public Information */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              2. Public Information Source
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              All conviction records on FraudCheckr are sourced from public federal court records and official proceedings. While we verify data against official sources, we cannot guarantee absolute accuracy.
            </p>
            <p className={textSecondaryClass}>
              For official, certified records, please contact:
            </p>
            <ul className={`space-y-2 mt-4 ${textSecondaryClass}`}>
              <li>• <strong>EFCC Official Website:</strong> www.efcc.gov.ng</li>
              <li>• <strong>Federal High Courts:</strong> contact your local court directly</li>
              <li>• <strong>Court Records:</strong> verify with the presiding judge's office</li>
            </ul>
          </section>

          {/* No Verification */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              3. Limited Verification
            </h2>
            <p className={`${textSecondaryClass}`}>
              While we make reasonable efforts to ensure data accuracy, FraudCheckr:
            </p>
            <ul className={`space-y-2 mt-4 ${textSecondaryClass}`}>
              <li>• Does not independently investigate all records</li>
              <li>• Cannot verify the current status of convictions (e.g., appeals pending)</li>
              <li>• May have incomplete information about ongoing cases</li>
              <li>• Relies on historical data that may not reflect recent developments</li>
            </ul>
          </section>

          {/* Responsible Use */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              4. Responsible Use Only
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              FraudCheckr is intended for legitimate purposes only, including:
            </p>
            <ul className={`space-y-2 ${textSecondaryClass}`}>
              <li>✓ Journalism and investigative reporting</li>
              <li>✓ Academic and research purposes</li>
              <li>✓ Compliance and due diligence</li>
              <li>✓ Personal information verification</li>
              <li>✓ Public interest research</li>
            </ul>
            <p className={`${textSecondaryClass} mt-4`}>
              Prohibited uses include harassment, discrimination, unauthorized background checks, or violating individuals' privacy rights.
            </p>
          </section>

          {/* No Liability */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <Shield className="w-6 h-6 text-orange-500" />
              5. Limitation of Liability
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              To the maximum extent permitted by law, FraudCheckr shall not be liable for:
            </p>
            <ul className={`space-y-2 ${textSecondaryClass}`}>
              <li>• Inaccuracies or omissions in conviction data</li>
              <li>• Damages resulting from reliance on information</li>
              <li>• Lost income, profits, or business opportunities</li>
              <li>• Decisions made based on FraudCheckr data</li>
              <li>• Service interruptions or downtime</li>
              <li>• Unauthorized access to user data</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              6. Indemnification
            </h2>
            <p className={textSecondaryClass}>
              You agree to indemnify and hold harmless FraudCheckr, its owners, operators, and employees from any claims, damages, or losses arising from your use of the site, misuse of data, or violations of applicable laws.
            </p>
          </section>

          {/* Accuracy Disclaimer */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              7. Verification of Information
            </h2>
            <p className={`${textSecondaryClass}`}>
              Before taking any action based on information from FraudCheckr, you should:
            </p>
            <ul className={`space-y-2 mt-4 ${textSecondaryClass}`}>
              <li>1. Consult with qualified legal counsel</li>
              <li>2. Verify information with official federal court records and sources</li>
              <li>3. Contact relevant courts for current case status</li>
              <li>4. Cross-check with multiple reliable sources</li>
              <li>5. Document verification for your records</li>
            </ul>
          </section>

          {/* Changes & Updates */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              8. Disclaimer of Warranties
            </h2>
            <p className={textSecondaryClass}>
              FraudCheckr is provided "AS IS" without any warranties of any kind, express or implied. We do not warrant that:
            </p>
            <ul className={`space-y-2 mt-4 ${textSecondaryClass}`}>
              <li>• The site will be uninterrupted or error-free</li>
              <li>• Information will be accurate or complete</li>
              <li>• The site is free of viruses or malicious code</li>
              <li>• Data will be available at all times</li>
            </ul>
          </section>

          {/* Third-Party Content */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              9. Third-Party Links & Content
            </h2>
            <p className={`${textSecondaryClass}`}>
              FraudCheckr may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of external sites. Use third-party content at your own risk.
            </p>
          </section>

          {/* Copyright */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              10. Intellectual Property Rights
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              FraudCheckr's original content is protected by copyright. You may not reproduce, distribute, or republish content without permission.
            </p>
            <p className={textSecondaryClass}>
              Fraud conviction data from federal courts is public information and may be subject to different licensing. Contact us for licensing inquiries.
            </p>
          </section>

          {/* Severability */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              11. Severability
            </h2>
            <p className={textSecondaryClass}>
              If any provision of this disclaimer is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section className={`p-6 rounded-lg border border-red-500/30 ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              Questions About This Disclaimer?
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              If you have concerns about information accuracy or need clarification:
            </p>
            <p className={`${textSecondaryClass}`}>
              <strong>Email:</strong> support@fraudcheckr.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
