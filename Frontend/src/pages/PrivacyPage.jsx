import React from "react";
import { Shield, Lock, Eye, AlertCircle } from "lucide-react";

const PrivacyPage = ({ isDark }) => {
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
            <Lock className="w-8 h-8 text-blue-500" />
            <h1 className={`text-4xl md:text-5xl font-bold ${headingClass}`}>
              Privacy Policy
            </h1>
          </div>
          <p className={`text-lg ${textSecondaryClass}`}>
            Last Updated: March 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              Introduction
            </h2>
            <p className={textSecondaryClass}>
              FraudCheckr ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          {/* Data Collection */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <Eye className="w-6 h-6 text-blue-500" />
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className={`font-semibold ${headingClass} mb-2`}>
                  Automatically Collected Information
                </h3>
                <ul className={`space-y-2 ${textSecondaryClass}`}>
                  <li>• IP address and device information</li>
                  <li>• Browser type, version, and operating system</li>
                  <li>• Pages visited and time spent on each page</li>
                  <li>• Referring URL and exit page</li>
                  <li>• Search queries and filters used</li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold ${headingClass} mb-2`}>
                  Voluntarily Provided Information
                </h3>
                <ul className={`space-y-2 ${textSecondaryClass}`}>
                  <li>• Contact form submissions</li>
                  <li>• API subscription details (for paid users)</li>
                  <li>• Feedback and support requests</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              2. How We Use Your Information
            </h2>
            <ul className={`space-y-3 ${textSecondaryClass}`}>
              <li>✓ Provide, maintain, and improve our services</li>
              <li>✓ Process API subscriptions and payments</li>
              <li>✓ Send technical updates and support communications</li>
              <li>✓ Monitor usage patterns to optimize performance</li>
              <li>✓ Comply with legal obligations</li>
              <li>✓ Prevent fraud and security issues</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <Shield className="w-6 h-6 text-green-500" />
              3. Data Protection & Security
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              We implement comprehensive security measures to protect your information:
            </p>
            <ul className={`space-y-3 ${textSecondaryClass}`}>
              <li>• HTTPS encryption for all transmitted data</li>
              <li>• Secure database encryption at rest</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• Limited access to personal information</li>
              <li>• Strict employee confidentiality agreements</li>
              <li>• Incident response procedures in place</li>
            </ul>
          </section>

          {/* No Data Sharing */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              4. Data Sharing & Third Parties
            </h2>
            <p className={`${textSecondaryClass}`}>
              We do <strong>NOT</strong> sell, rent, or trade your personal information. We only share information:
            </p>
            <ul className={`space-y-3 mt-4 ${textSecondaryClass}`}>
              <li>• With service providers (hosting, payment processing) under strict confidentiality agreements</li>
              <li>• When required by law or legal process</li>
              <li>• To protect against fraud or security threats</li>
              <li>• With your explicit consent</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              5. Cookies & Tracking Technologies
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              We use cookies for:
            </p>
            <ul className={`space-y-2 ${textSecondaryClass}`}>
              <li>• Remembering user preferences (theme settings)</li>
              <li>• Analyzing website usage (analytics only)</li>
              <li>• Improving user experience</li>
            </ul>
            <p className={`${textSecondaryClass} mt-4`}>
              You can disable cookies in your browser settings. This may impact functionality.
            </p>
          </section>

          {/* User Rights */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              6. Your Rights
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              You have the right to:
            </p>
            <ul className={`space-y-3 ${textSecondaryClass}`}>
              <li>• Access personal information we hold about you</li>
              <li>• Request correction of inaccurate data</li>
              <li>• Request deletion of your data (where applicable)</li>
              <li>• Opt-out of non-essential communications</li>
              <li>• Export your data in a portable format</li>
            </ul>
            <p className={`${textSecondaryClass} mt-4`}>
              Contact privacy@fraudcheckr.com to exercise these rights.
            </p>
          </section>

          {/* CCPA/GDPR */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              7. Global Privacy Compliance
            </h2>
            <p className={`${textSecondaryClass} mb-4`}>
              <strong>GDPR (EU Users):</strong> We comply with GDPR requirements for European users. Your data is only processed with a lawful basis.
            </p>
            <p className={`${textSecondaryClass}`}>
              <strong>CCPA (California Users):</strong> California residents have specific rights under CCPA. Visit our CCPA page for details.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className={`p-6 rounded-lg border ${bgClass} ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>
              8. Changes to This Policy
            </h2>
            <p className={`${textSecondaryClass}`}>
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notice on our website. Your continued use of FraudCheckr constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className={`p-6 rounded-lg border border-blue-500/30 ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>
            <h2 className={`text-2xl font-bold ${headingClass} mb-4 flex items-center gap-2`}>
              <AlertCircle className="w-6 h-6 text-blue-500" />
              Questions About Privacy?
            </h2>
            <p className={textSecondaryClass}>
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className={`mt-4 space-y-2 ${textSecondaryClass}`}>
              <p><strong>Email:</strong> privacy@fraudcheckr.com</p>
              <p><strong>Address:</strong> FraudCheckr Team, Lagos, Nigeria</p>
              <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
