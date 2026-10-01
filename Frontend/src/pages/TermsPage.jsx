import React from "react";
import { FileText, AlertCircle, Users, Zap } from "lucide-react";

const TermsPage = ({ isDark }) => {
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
            <FileText className="w-8 h-8 text-blue-500" />
            <h1 className={`text-4xl md:text-5xl font-bold ${headingClass}`}>
              Terms of Service
            </h1>
          </div>
          <p className={`text-lg ${textSecondaryClass}`}>
            Last Updated: March 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Agreement */}
          <section>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              1. Agreement to Terms
            </h2>
            <p className={textSecondaryClass}>
              By accessing and using FraudCheckr, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* License */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              2. License to Use
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              Permission is granted to temporarily download one copy of the materials (information or software) on FraudCheckr for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <p className={textSecondaryClass}>
              Under this license you may not:
            </p>
            <ul className={`space-y-2 mt-4 ${textSecondaryClass}`}>
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for any commercial purpose or for any public display</li>
              <li>• Attempt to decompile or reverse engineer any software contained on the site</li>
              <li>• Remove any copyright or other proprietary notations from the materials</li>
              <li>• Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>• Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <Zap className="w-6 h-6 text-yellow-500" />
              3. Acceptable Use Policy
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              You agree not to use FraudCheckr for:
            </p>
            <ul className={`space-y-2 ${textSecondaryClass}`}>
              <li>• Harassing, threatening, or abusing any individual</li>
              <li>• Accessing unauthorized systems or data</li>
              <li>• Transmitting illegal content or materials</li>
              <li>• Spam, phishing, or malware distribution</li>
              <li>• Impersonating others or false representation</li>
              <li>• Violating intellectual property rights</li>
              <li>• Commercial scraping or bulk downloading</li>
              <li>• Circumventing security measures</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <AlertCircle className="w-6 h-6 text-orange-500" />
              4. Disclaimer of Warranties
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              The materials on FraudCheckr are provided on an 'as is' basis. FraudCheckr makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className={textSecondaryClass}>
              Further, FraudCheckr does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p>
            <p className={`${textSecondaryClass} mt-4`}>
              FraudCheckr provides conviction-screening signals and public-record research tools only. It is not a substitute for legal advice, formal identity verification, sanctions screening, credit reporting, or any regulated decisioning workflow that requires direct source validation.
            </p>
          </section>

          {/* Limitations of Liability */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              5. Limitations of Liability
            </h2>
            <p className={textSecondaryClass}>
              In no event shall FraudCheckr or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FraudCheckr, even if FraudCheckr or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Accuracy of Materials */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              6. Accuracy of Materials
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              The materials appearing on FraudCheckr could include technical, typographical, or photographic errors. FraudCheckr does not warrant that any of the materials on the site are accurate, complete, or current.
            </p>
            <p className={textSecondaryClass}>
              While we strive for accuracy, all data is provided "as-is" from official federal court records and public proceedings. We recommend verifying critical information with official channels before making important decisions.
            </p>
          </section>

          {/* Links */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              7. Links
            </h2>
            <p className={`${textSecondaryClass}`}>
              FraudCheckr has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FraudCheckr of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          {/* Modifications */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              8. Modifications
            </h2>
            <p className={textSecondaryClass}>
              FraudCheckr may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Governing Law */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              9. Governing Law
            </h2>
            <p className={textSecondaryClass}>
              These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts located in Lagos, Nigeria.
            </p>
          </section>

          {/* Payment Terms */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <Users className="w-6 h-6 text-purple-500" />
              10. API Subscription Terms
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className={`font-semibold ${headingClass} mb-2`}>Billing</h3>
                <p className={textSecondaryClass}>
                  Subscriptions are billed monthly on the same date each month. We accept major credit cards and mobile money platforms.
                </p>
              </div>
              <div>
                <h3 className={`font-semibold ${headingClass} mb-2`}>Cancellation</h3>
                <p className={textSecondaryClass}>
                  You may cancel your subscription at any time. No refunds for partial months, but you retain access until your billing cycle ends.
                </p>
              </div>
              <div>
                <h3 className={`font-semibold ${headingClass} mb-2`}>Rate Limits</h3>
                <p className={textSecondaryClass}>
                  API calls are subject to platform rate limits and abuse controls. Excessive usage may result in temporary throttling or suspension.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className={`p-6 rounded-lg border border-blue-500/30 ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              Questions About These Terms?
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <p className={`${textSecondaryClass}`}>
              <strong>Email:</strong> legal@fraudcheckr.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
