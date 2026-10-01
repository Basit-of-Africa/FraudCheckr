import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Code, Copy, Menu, X } from "lucide-react";
import { fetchDeveloperPlans } from "../lib/developerAuth";

const sections = [
  { id: "overview", label: "Overview", icon: "API" },
  { id: "quickstart", label: "Quick Start", icon: "01" },
  { id: "auth", label: "Authentication", icon: "02" },
  { id: "billing", label: "Paystack Billing", icon: "03" },
  { id: "pricing", label: "Pricing", icon: "04" },
  { id: "endpoints", label: "Endpoints", icon: "05" },
  { id: "examples", label: "Code Examples", icon: "06" },
  { id: "notes", label: "Product Notes", icon: "07" },
];

const endpointRows = [
  ["POST", "/developer/auth/signup", "Create a developer account"],
  ["POST", "/developer/auth/login", "Create a developer dashboard session"],
  ["GET", "/developer/me", "Check subscription and account status"],
  ["POST", "/developer/billing/initialize", "Start Paystack checkout"],
  ["POST", "/developer/billing/webhook", "Handle Paystack payment confirmation"],
  ["GET", "/developer/api-keys", "List issued API keys"],
  ["POST", "/developer/api-keys/rotate", "Rotate and reveal a new API key"],
  ["GET", "/developer/v1/search?name={name}", "Paid developer API search"],
  ["GET", "/developer/v1/convictions", "Paid developer API convictions list"],
  ["GET", "/developer/v1/offense?type={type}", "Paid developer API offense filter"],
  ["GET", "/developer/v1/court?name={name}", "Paid developer API court filter"],
  ["GET", "/developer/v1/stats", "Paid developer API statistics"],
];

const codeExamples = [
  {
    id: "signup",
    title: "Create a developer account",
    code: `curl -X POST "https://your-backend-origin/developer/auth/signup" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "team@example.com",
    "password": "super-secure-password"
  }'`,
  },
  {
    id: "billing",
    title: "Initialize Paystack checkout",
    code: `curl -X POST "https://your-backend-origin/developer/billing/initialize" \\
  -H "Authorization: Bearer <dashboard_session_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"plan_name":"Developer API Monthly"}'`,
  },
  {
    id: "search",
    title: "Run a paid background-check search",
    code: `curl "https://your-backend-origin/developer/v1/search?name=JOHN%20DOE" \\
  -H "X-API-Key: fchk_live_your_api_key"`,
  },
  {
    id: "response",
    title: "Search response shape",
    code: `{
  "total": 1,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "name": "JOHN DOE",
      "offense": "FRAUD",
      "prison_term": "5 YEARS",
      "prison_term_months": 60,
      "fine": "5000000",
      "restitution": "1000000",
      "court": "FEDERAL HIGH COURT"
    }
  ]
}`,
  },
];

const DeveloperPage = ({ isDark }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (sections.some((section) => section.id === sectionId)) {
      setActiveSection(sectionId);
    }
  }, [location.hash]);

  useEffect(() => {
    setPlansLoading(true);
    fetchDeveloperPlans()
      .then((data) => {
        setPlans(data.plans || []);
        setPlansError(null);
      })
      .catch((error) => {
        setPlansError("Unable to load pricing plans at this time.");
      })
      .finally(() => setPlansLoading(false));
  }, []);

  const panelClass = isDark
    ? "bg-slate-800/60 border-slate-700"
    : "bg-white border-gray-200";
  const mutedTextClass = isDark ? "text-slate-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const pageClass = isDark ? "bg-slate-950" : "bg-gray-50";
  const codeClass = isDark
    ? "bg-gray-950 border-slate-700 text-green-400"
    : "bg-gray-100 border-gray-200 text-green-700";
  const activeNavClass = isDark
    ? "bg-blue-600/15 text-blue-300 border-blue-500"
    : "bg-blue-50 text-blue-700 border-blue-500";

  const copyToClipboard = (value, id) => {
    navigator.clipboard.writeText(value);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <section className={`rounded-2xl border p-8 ${panelClass}`}>
              <p className="text-sm font-semibold tracking-[0.2em] text-blue-500 uppercase mb-3">
                FraudCheckr Developer API
              </p>
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${headingClass}`}>
                Build KYC and background-check workflows on conviction data
              </h1>
              <p className={`text-lg leading-8 max-w-3xl ${mutedTextClass}`}>
                FraudCheckr exposes a paid developer API for screening names against
                public conviction records. The public website remains open for browsing,
                while the developer API is gated behind account creation, Paystack
                payment, and issued API keys.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/developers/signup"
                  className="rounded-xl bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700"
                >
                  Create developer account
                </Link>
                <Link
                  to="/developers/login"
                  className={`rounded-xl border px-5 py-3 font-semibold ${isDark ? "border-slate-700 text-slate-200" : "border-gray-300 text-gray-800"}`}
                >
                  Sign in
                </Link>
                <Link
                  to="/developers/account"
                  className={`rounded-xl border px-5 py-3 font-semibold ${isDark ? "border-slate-700 text-slate-200" : "border-gray-300 text-gray-800"}`}
                >
                  Open account
                </Link>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              {[
                "Name-based conviction screening for onboarding and KYC",
                "Server-to-server API access with issued API keys",
                "Paystack-gated subscription flow for developer access",
                "Search, offense, court, conviction list, and stats endpoints",
              ].map((item) => (
                <div key={item} className={`rounded-2xl border p-6 ${panelClass}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`${mutedTextClass} leading-7`}>{item}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        );

      case "quickstart":
        return (
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Quick Start</h1>
            {[
              "Create a developer account with /developer/auth/signup.",
              "Store the returned dashboard session token for account and billing actions.",
              "Call /developer/billing/initialize to start a Paystack checkout session.",
              "After Paystack webhook confirmation, rotate an API key from /developer/api-keys/rotate.",
              "Use that API key against /developer/v1/search and related paid endpoints.",
            ].map((step, index) => (
              <div key={step} className={`rounded-2xl border p-6 ${panelClass}`}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <p className={`pt-1 leading-7 ${mutedTextClass}`}>{step}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "auth":
        return (
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Authentication</h1>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <h2 className={`text-2xl font-semibold mb-3 ${headingClass}`}>Dashboard session token</h2>
              <p className={`mb-4 leading-7 ${mutedTextClass}`}>
                The developer dashboard uses a bearer session token returned from
                signup or login. Use it for account status, billing, and key rotation.
              </p>
              <div className={`rounded-xl border p-4 ${codeClass}`}>
                <code>Authorization: Bearer &lt;dashboard_session_token&gt;</code>
              </div>
            </div>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <h2 className={`text-2xl font-semibold mb-3 ${headingClass}`}>API key</h2>
              <p className={`mb-4 leading-7 ${mutedTextClass}`}>
                Paid data endpoints use an issued API key. FraudCheckr shows the full
                key once at rotation time, so store it securely on your server.
              </p>
              <div className={`rounded-xl border p-4 ${codeClass}`}>
                <code>X-API-Key: fchk_live_your_api_key</code>
              </div>
            </div>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Paystack Billing</h1>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <p className={`leading-7 ${mutedTextClass}`}>
                Developer access is intentionally put behind a Paystack paywall. The
                backend initializes checkout, Paystack calls back to the webhook, and
                a successful payment activates the subscription window used to gate the
                developer API.
              </p>
            </div>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>Required backend configuration</h2>
              <div className={`rounded-xl border p-4 ${codeClass}`}>
                <pre className="whitespace-pre-wrap text-sm">{`PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_CALLBACK_URL=https://your-frontend-origin/developers
DEVELOPER_API_PLAN_NAME=Developer API Monthly
DEVELOPER_API_PLAN_AMOUNT_KOBO=500000`}</pre>
              </div>
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Pricing</h1>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <p className={`leading-7 ${mutedTextClass}`}>
                Choose the plan that fits your compliance workflow. Plans are loaded
                dynamically from the backend so the frontend always reflects current
                pricing and included capabilities.
              </p>
            </div>
            {plansLoading ? (
              <div className={`rounded-2xl border p-6 ${panelClass}`}>
                <p className={mutedTextClass}>Loading pricing plans...</p>
              </div>
            ) : plansError ? (
              <div className={`rounded-2xl border p-6 ${panelClass}`}>
                <p className="text-red-500">{plansError}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div key={plan.name} className={`rounded-3xl border p-6 ${panelClass}`}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className={`text-2xl font-semibold ${headingClass}`}>{plan.name}</h2>
                        <p className={`text-sm ${mutedTextClass}`}>{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{plan.price_kobo === 0 ? "Free" : `₦${(plan.price_kobo / 100).toLocaleString()}`}</p>
                        <p className="text-sm text-gray-500">per month</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold mb-2">Quota</p>
                        <p className="text-sm text-slate-600">API calls: {plan.api_call_quota === -1 ? "Unlimited" : plan.api_call_quota}</p>
                        <p className="text-sm text-slate-600">Reports: {plan.report_quota === -1 ? "Unlimited" : plan.report_quota}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold mb-2">Features</p>
                        <ul className="space-y-2 text-sm text-slate-600">
                          {(plan.feature_list || []).map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <span className="mt-1 text-blue-500">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "endpoints":
        return (
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Endpoints</h1>
            <div className={`rounded-2xl border overflow-hidden ${panelClass}`}>
              <div className={`grid grid-cols-[100px,1fr,1.2fr] px-4 py-3 text-sm font-semibold border-b ${isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700"}`}>
                <div>Method</div>
                <div>Path</div>
                <div>Purpose</div>
              </div>
              {endpointRows.map(([method, path, purpose]) => (
                <div
                  key={path}
                  className={`grid grid-cols-[100px,1fr,1.2fr] gap-4 px-4 py-4 text-sm border-b last:border-b-0 ${isDark ? "border-slate-800 text-slate-300" : "border-gray-200 text-gray-700"}`}
                >
                  <div>
                    <span className="inline-flex px-2 py-1 rounded bg-blue-600 text-white font-semibold">
                      {method}
                    </span>
                  </div>
                  <code className="break-all">{path}</code>
                  <div>{purpose}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-8">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Code Examples</h1>
            {codeExamples.map((example) => (
              <section key={example.id} className={`rounded-2xl border overflow-hidden ${panelClass}`}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                  <div>
                    <h2 className={`text-xl font-semibold ${headingClass}`}>{example.title}</h2>
                  </div>
                  <button
                    onClick={() => copyToClipboard(example.code, example.id)}
                    className={`p-2 rounded-lg transition ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                    title="Copy code"
                  >
                    {copiedCode === example.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <div className={`border-t-0 p-5 ${codeClass}`}>
                  <pre className="overflow-x-auto text-sm whitespace-pre-wrap">{example.code}</pre>
                </div>
              </section>
            ))}
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold ${headingClass}`}>Product Notes</h1>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <p className={`leading-7 ${mutedTextClass}`}>
                FraudCheckr is best positioned today as a conviction-screening signal
                for internal risk reviews, onboarding checks, and manual investigation
                support. It is not yet a full identity-verification platform, watchlist
                product, or sanctions engine.
              </p>
            </div>
            <div className={`rounded-2xl border p-6 ${panelClass}`}>
              <h2 className={`text-2xl font-semibold mb-3 ${headingClass}`}>What to add next</h2>
              <ul className={`space-y-3 leading-7 ${mutedTextClass}`}>
                <li>Rate limiting and per-key quotas</li>
                <li>Usage analytics and invoices in the developer dashboard</li>
                <li>Webhook retries and payment reconciliation tools</li>
                <li>Structured person records beyond raw conviction search</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${pageClass}`}>
      <div className={`sticky top-0 z-40 backdrop-blur border-b ${isDark ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-500 font-semibold tracking-[0.2em] uppercase">Developers</p>
            <h1 className={`text-2xl font-bold ${headingClass}`}>FraudCheckr API</h1>
          </div>
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className={`md:hidden p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
            aria-label={sidebarOpen ? "Close developer navigation" : "Open developer navigation"}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        <aside
          className={`fixed md:static inset-y-0 md:inset-y-auto top-[73px] md:top-0 w-72 shrink-0 border-r transition-all duration-300 z-30 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
          } ${sidebarOpen ? "left-0" : "-left-72 md:left-0"}`}
        >
          <div className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  activeSection === section.id
                    ? activeNavClass
                    : isDark
                    ? "border-transparent text-slate-300 hover:bg-slate-800"
                    : "border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs font-semibold tracking-[0.2em] uppercase w-8">
                  {section.icon}
                </span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl">{renderContent()}</div>
        </main>
      </div>

      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close developer navigation overlay"
        />
      )}
    </div>
  );
};

export default DeveloperPage;
