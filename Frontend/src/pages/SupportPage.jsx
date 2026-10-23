import React from "react";
import { Headphones, MailIcon, AlertCircle, Clock } from "lucide-react";

const SupportPage = ({ isDark }) => {
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const bgClass = isDark ? "bg-slate-800" : "bg-gray-50";
  const borderClass = isDark ? "border-slate-700" : "border-gray-200";

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Headphones className="w-10 h-10 text-blue-500" />
            <h1 className={`text-4xl md:text-5xl font-bold ${headingClass}`}>
              Support Center
            </h1>
          </div>
          <p className={`text-xl ${textSecondaryClass} max-w-2xl mx-auto`}>
            Help with searching, the API, and reporting a record that is wrong.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Status */}
          <a href="/disclaimer#corrections" className={`p-8 rounded-lg border text-center transition-all hover:shadow-lg ${bgClass} ${borderClass}`}>
            <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className={`text-xl font-bold ${headingClass} mb-2`}>Corrections</h3>
            <p className={textSecondaryClass}>Report a record that is wrong or about you</p>
          </a>

          {/* Documentation */}
          <a href="/docs" className={`p-8 rounded-lg border text-center transition-all hover:shadow-lg ${bgClass} ${borderClass}`}>
            <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className={`text-xl font-bold ${headingClass} mb-2`}>Documentation</h3>
            <p className={textSecondaryClass}>Read guides and API docs</p>
          </a>

          {/* FAQ */}
          <a href="/faq" className={`p-8 rounded-lg border text-center transition-all hover:shadow-lg ${bgClass} ${borderClass}`}>
            <AlertCircle className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className={`text-xl font-bold ${headingClass} mb-2`}>FAQ</h3>
            <p className={textSecondaryClass}>Common questions answered</p>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div>
            <h2 className={`text-3xl font-bold ${headingClass} mb-8`}>Get Help</h2>

            {/* Email Support */}
            <div className={`p-6 rounded-lg border mb-6 ${bgClass} ${borderClass}`}>
              <div className="flex items-start gap-4">
                <MailIcon className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold ${headingClass} mb-2`}>Email Support</h3>
                  <p className={textSecondaryClass}>Get detailed help via email</p>
                  <p className="mt-4">
                    <a href="mailto:support@fraudcheckr.com" className="text-blue-500 hover:text-blue-600 font-semibold">
                      support@fraudcheckr.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Priority Support */}
            <div className={`p-6 rounded-lg border mb-6 ${isDark ? "bg-purple-500/10 border-purple-500/30" : "bg-purple-50 border-purple-200"}`}>
              <div className="flex items-start gap-4">
                <Headphones className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold ${headingClass} mb-2`}>API Support</h3>
                  <p className={textSecondaryClass}>For API customers only</p>
                  <p className="mt-4">
                    <a href="mailto:api@fraudcheckr.com" className="text-purple-500 hover:text-purple-600 font-semibold">
                      api@fraudcheckr.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div>
            <h2 className={`text-3xl font-bold ${headingClass} mb-8`}>Troubleshooting</h2>

            <div className="space-y-4">
              {/* Issue 1 */}
              <details className={`group rounded-lg border p-4 cursor-pointer transition-all ${bgClass} ${borderClass}`}>
                <summary className={`font-semibold flex justify-between items-center ${headingClass}`}>
                  <span>Search returns no results</span>
                  <span className="group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className={`mt-4 ${textSecondaryClass} space-y-2`}>
                  <p>Try these steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Try another spelling; the EFCC's tables vary</li>
                    <li>Try a surname on its own</li>
                    <li>Remember the data only covers the EFCC's published tables</li>
                  </ul>
                </div>
              </details>

              {/* Issue 2 */}
              <details className={`group rounded-lg border p-4 cursor-pointer transition-all ${bgClass} ${borderClass}`}>
                <summary className={`font-semibold flex justify-between items-center ${headingClass}`}>
                  <span>Site is slow or not loading</span>
                  <span className="group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className={`mt-4 ${textSecondaryClass} space-y-2`}>
                  <p>Try these steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Check your internet connection</li>
                    <li>Reload the page</li>
                    <li>Try a different browser</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>
              </details>

              {/* Issue 3 */}
              <details className={`group rounded-lg border p-4 cursor-pointer transition-all ${bgClass} ${borderClass}`}>
                <summary className={`font-semibold flex justify-between items-center ${headingClass}`}>
                  <span>API authentication error</span>
                  <span className="group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className={`mt-4 ${textSecondaryClass} space-y-2`}>
                  <p>Common causes:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Invalid or revoked API key</li>
                    <li>Missing X-API-Key header</li>
                    <li>Inactive subscription</li>
                    <li>Incorrect API endpoint URL</li>
                    <li>Rate limit exceeded</li>
                  </ul>
                  <p className="mt-3 text-sm">Email api@fraudcheckr.com with the error message and the first few characters of your key. Never send a full API key.</p>
                </div>
              </details>

              {/* Issue 4 */}
              <details className={`group rounded-lg border p-4 cursor-pointer transition-all ${bgClass} ${borderClass}`}>
                <summary className={`font-semibold flex justify-between items-center ${headingClass}`}>
                  <span>I think I found incorrect data</span>
                  <span className="group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <div className={`mt-4 ${textSecondaryClass} space-y-2`}>
                  <p>Email accuracy@fraudcheckr.com with:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>The record ID (for example FC2024-0848)</li>
                    <li>What is wrong, and what is correct</li>
                    <li>Any court document or reference that shows it</li>
                  </ul>
                  <p className="text-sm">
                    See the <a href="/disclaimer#corrections" className="text-blue-500 hover:text-blue-600">corrections process</a>.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className={`${textSecondaryClass} mb-6`}>
            Still need help?
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg transition"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
