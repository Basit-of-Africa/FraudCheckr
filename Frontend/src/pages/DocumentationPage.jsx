import React, { useState } from "react";
import { Code, CreditCard, FileText, Zap } from "lucide-react";

const DocumentationPage = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState("getting-started");

  const bgClass = isDark ? "bg-slate-900" : "bg-white";
  const cardBgClass = isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const codeBgClass = isDark ? "bg-gray-950" : "bg-gray-100";

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Zap },
    { id: "api", label: "API Reference", icon: Code },
    { id: "pricing", label: "API Pricing", icon: CreditCard },
    { id: "examples", label: "Code Examples", icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>5-Minute Setup</h3>
              <ol className={`space-y-4 ${textSecondaryClass}`}>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">1.</span>
                  <div>
                    <strong className={headingClass}>Visit FraudCheckr</strong>
                    <p>Open the public search experience to explore conviction records and analytics.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">2.</span>
                  <div>
                    <strong className={headingClass}>Create a developer account</strong>
                    <p>Use the Developers section to sign up, manage billing, and access your dashboard.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">3.</span>
                  <div>
                    <strong className={headingClass}>Complete Paystack checkout</strong>
                    <p>Activate the paid developer plan before attempting to generate or rotate live API keys.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">4.</span>
                  <div>
                    <strong className={headingClass}>Rotate a live API key</strong>
                    <p>Store the revealed key securely and use it only from your backend or trusted services.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Dataset Overview</h3>
              <div className={`p-6 rounded-xl border ${cardBgClass}`}>
                <p className={textSecondaryClass}>
                  FraudCheckr organizes verified public fraud-conviction records from Nigeria&apos;s federal courts into a screening and research workflow.
                </p>
                <ul className={`mt-4 space-y-2 ${textSecondaryClass}`}>
                  <li>✓ 7,788 total conviction records</li>
                  <li>✓ 33 Federal High Courts covered</li>
                  <li>✓ 192 distinct offense types</li>
                  <li>✓ Structured sentencing, fine, and restitution fields</li>
                  <li>✓ Developer screening reports for KYC and compliance review</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Developer API Endpoints</h3>
              <div className="space-y-6">
                {[
                  {
                    method: "POST",
                    endpoint: "/developer/v1/screen",
                    description: "Create a screening report for a person name and optional aliases or location context",
                  },
                  {
                    method: "GET",
                    endpoint: "/developer/v1/search?name={name}",
                    description: "Search convictions by defendant name",
                  },
                  {
                    method: "GET",
                    endpoint: "/developer/v1/offense?type={type}",
                    description: "Filter convictions by offense type",
                  },
                  {
                    method: "GET",
                    endpoint: "/developer/v1/court?name={name}",
                    description: "Find convictions by court",
                  },
                  {
                    method: "GET",
                    endpoint: "/developer/v1/stats",
                    description: "Get aggregate conviction statistics",
                  },
                ].map((endpoint) => (
                  <div key={endpoint.endpoint} className={`p-6 rounded-xl border ${cardBgClass}`}>
                    <div className="flex items-start gap-4">
                      <span className={`px-3 py-1 rounded text-white font-bold text-sm ${endpoint.method === "GET" ? "bg-blue-600" : "bg-green-600"}`}>
                        {endpoint.method}
                      </span>
                      <div>
                        <code className={`block ${codeBgClass} p-2 rounded mb-2 font-mono text-sm`}>
                          {endpoint.endpoint}
                        </code>
                        <p className={textSecondaryClass}>{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Authentication</h3>
              <div className={`p-6 rounded-xl border ${cardBgClass}`}>
                <p className={`${textSecondaryClass} mb-4`}>
                  FraudCheckr uses dashboard session tokens for account actions and live API keys for paid data requests.
                </p>
                <pre className={`${codeBgClass} p-4 rounded overflow-x-auto text-sm`}>
{`Authorization: Bearer <dashboard_session_token>
X-API-Key: fchk_live_your_api_key`}
                </pre>
              </div>
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Web Search - Free</h3>
              <div className={`p-6 rounded-xl border border-green-500/40 ${cardBgClass}`}>
                <p className={textSecondaryClass}>
                  The public web experience remains free for search, browsing, and analytics.
                </p>
                <ul className={`mt-4 space-y-2 ${textSecondaryClass}`}>
                  <li>✓ Quick record lookups</li>
                  <li>✓ Case exploration and analytics</li>
                  <li>✓ Research-friendly browsing across public records</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Developer API - Paid</h3>
              <p className={`${textSecondaryClass} mb-6`}>
                FraudCheckr currently offers a single paid developer plan managed through Paystack and the developer dashboard.
              </p>
              <div className={`p-6 rounded-xl border border-blue-500/40 ${cardBgClass}`}>
                <h4 className={`text-xl font-bold ${headingClass} mb-2`}>Developer API Monthly</h4>
                <p className={`text-sm ${textSecondaryClass} mb-4`}>
                  Access is enabled after Paystack payment and includes screening reports, search endpoints, report history, and API-key rotation.
                </p>
                <ul className={`space-y-2 ${textSecondaryClass} mb-6`}>
                  <li>✓ Screening reports for onboarding and compliance review</li>
                  <li>✓ Account-managed API key rotation</li>
                  <li>✓ FraudCheckr dashboard access for billing and saved reports</li>
                  <li>✓ Built-in rate limiting and abuse protection</li>
                </ul>
                <button className="w-full py-2 rounded font-semibold transition bg-blue-600 text-white hover:bg-blue-700">
                  Open Developer Dashboard
                </button>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Billing Notes</h3>
              <div className={`p-6 rounded-xl border ${cardBgClass}`}>
                <ul className={`space-y-3 ${textSecondaryClass}`}>
                  <li><strong className={headingClass}>Payment Methods:</strong> Paystack-supported card and bank payment methods</li>
                  <li><strong className={headingClass}>Billing Cycle:</strong> Monthly access window after successful payment</li>
                  <li><strong className={headingClass}>Cancellation:</strong> You can stop renewing at any time</li>
                  <li><strong className={headingClass}>Refunds:</strong> Reviewed case by case for incorrect billing or material service failure</li>
                  <li><strong className={headingClass}>Usage Controls:</strong> Paid API keys are subject to platform rate limiting and abuse controls</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Python Example</h3>
              <div className={codeBgClass + " p-4 rounded-lg overflow-x-auto"}>
                <pre className="text-sm text-green-400">
{`import requests

response = requests.get(
  "https://your-backend-origin/developer/v1/search",
  params={"name": "JOHN DOE"},
  headers={"X-API-Key": "fchk_live_your_api_key"}
)

records = response.json()
for record in records["data"]:
  print(f"{record['name']} - {record['offense']}")`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>JavaScript Example</h3>
              <div className={codeBgClass + " p-4 rounded-lg overflow-x-auto"}>
                <pre className="text-sm text-green-400">
{`const axios = require("axios");

async function searchConvictions(name) {
  const response = await axios.get(
    "https://your-backend-origin/developer/v1/search",
    {
      params: { name },
      headers: { "X-API-Key": "fchk_live_your_api_key" }
    }
  );

  return response.data.data;
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>cURL Example</h3>
              <div className={codeBgClass + " p-4 rounded-lg overflow-x-auto"}>
                <pre className="text-sm text-green-400">
{`curl -X GET "https://your-backend-origin/developer/v1/search?name=JOHN%20DOE" \\
  -H "X-API-Key: fchk_live_your_api_key" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Getting Your API Key</h3>
              <ol className={`space-y-3 ${textSecondaryClass}`}>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span>Create a FraudCheckr developer account</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>Complete Paystack checkout from the developer dashboard</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span>Open your account dashboard at <code className={headingClass}>/developers/account</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span>Rotate a new live API key from the API Keys section</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">5.</span>
                  <span>Include the key in the <code className={headingClass}>X-API-Key</code> header of your paid API requests</span>
                </li>
              </ol>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold ${headingClass} mb-4`}>Documentation</h1>
          <p className={`text-xl ${textSecondaryClass}`}>
            Everything you need to integrate FraudCheckr into your application
          </p>
        </div>

        <div className={`flex flex-wrap gap-4 mb-8 p-4 rounded-lg ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === section.id
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
          {renderContent()}
        </div>

        <div className={`mt-20 bg-blue-600/20 border ${isDark ? "border-blue-700/30" : "border-blue-300/30"} p-12 rounded-2xl text-center`}>
          <h2 className={`text-3xl font-bold ${headingClass} mb-4`}>Need Help?</h2>
          <p className={`${textSecondaryClass} mb-8 max-w-2xl mx-auto`}>
            Check our FAQ, email support@fraudcheckr.com, or reach out to the team for onboarding support.
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
