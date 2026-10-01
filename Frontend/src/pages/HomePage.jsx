
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { Shield, Search, BarChart3, Lock, Zap, Globe } from "lucide-react";

const HomePage = ({ isDark }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-white"}`}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="relative max-w-4xl w-full z-10">
          <div className="text-center">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-4 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}>
              Powered by Public Records
            </p>
            <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Fraud<span className={isDark ? "text-blue-400" : "text-blue-600"}>Checkr</span>
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed mb-12 max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Access verified public fraud-conviction records from Nigeria's federal courts. Search, analyze, and stay informed with transparent data.
            </p>
            
            <div className="mb-16">
              <SearchBar isDark={isDark} />
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { label: "7,788+ Records", icon: "📊" },
                { label: "33+ Federal Courts", icon: "⚖️" },
                { label: "Real-time Updated", icon: "⚡" }
              ].map((stat, idx) => (
                <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? "bg-slate-800/50 text-gray-300" : "bg-gray-100 text-gray-700"
                }`}>
                  <span className="text-lg">{stat.icon}</span>
                  <span className="font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-24 px-4 border-t ${
        isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-100 bg-gray-50"
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Everything you need
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Comprehensive tools to search, analyze, and understand fraud conviction patterns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Search",
                description: "Find conviction records by defendant name with instant, accurate results"
              },
              {
                icon: BarChart3,
                title: "Deep Analytics",
                description: "Explore trends, statistics, and patterns across the entire database"
              },
              {
                icon: Globe,
                title: "Nationwide Coverage",
                description: "Access records from 33+ Federal High Courts across Nigeria"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className={`p-8 rounded-xl border transition-all duration-200 hover:border-blue-400 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-blue-500/10"
                    : "bg-white border-gray-200 hover:shadow-lg hover:shadow-blue-500/10"
                }`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isDark ? "bg-blue-500/20" : "bg-blue-100"
                  }`}>
                    <Icon className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={`py-20 px-4 ${isDark ? "" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${isDark ? "text-white" : "text-gray-900"}`}>
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Search",
                description: "Enter a defendant's name to search our database of 864 verified conviction records"
              },
              {
                step: 2,
                title: "Review",
                description: "View detailed case information including offense, court, sentence, and penalties"
              },
              {
                step: 3,
                title: "Analyze",
                description: "Explore statistics, trends, and patterns in fraud convictions across Nigeria"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-20 px-4 transition-colors ${isDark ? "bg-blue-900/30" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Conviction Records", value: "7,788" },
              { label: "Federal Courts", value: "33+" },
              { label: "Offense Types", value: "50+" },
              { label: "Years Covered", value: "2020-2024" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 px-4 ${isDark ? "" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
            Ready to Access the Data?
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Start exploring public conviction records today. Completely free and accessible to everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search?name=" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              Start Searching
            </Link>
            <Link to="/insights" className={`px-8 py-4 font-semibold rounded-lg border transition-all ${isDark ? "bg-slate-800 text-white border-slate-700 hover:border-gray-500" : "bg-white text-gray-900 border-gray-300 hover:border-gray-400 hover:shadow-md"}`}>
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`py-20 px-4 transition-colors ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${isDark ? "text-white" : "text-gray-900"}`}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is this data publicly available?",
                a: "Yes, all conviction records shown here are public information from official court proceedings and source publications including the Economic and Financial Crimes Commission website."
              },
              {
                q: "How often is the data updated?",
                a: "Our database is updated regularly with new convictions. The current dataset covers convictions from 2020-2024 with ongoing updates as new cases are finalized."
              },
              {
                q: "Can I download the data?",
                a: "Currently, data can be viewed through our web interface. API access and bulk download features are coming soon."
              },
              {
                q: "Is this information confidential?",
                a: "No, this is public information from court records. However, we encourage responsible use of this data for legitimate purposes only."
              },
              {
                q: "What if I find incorrect information?",
                a: "If you find discrepancies, please contact our support team. We cross-reference all data with official EFCC records."
              }
            ].map((faq, idx) => (
              <details key={idx} className={`group rounded-lg border p-6 cursor-pointer transition-colors ${isDark ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                <summary className={`flex justify-between items-center font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {faq.q}
                  <span className={`${isDark ? "text-gray-400" : "text-gray-600"} group-open:rotate-180 transition-transform`}>↓</span>
                </summary>
                <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className={`py-20 px-4 ${isDark ? "" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? "text-white" : "text-gray-900"}`}>
            Trusted by Organizations Nationwide
          </h2>
          <p className={`text-center mb-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Used by journalists, researchers, compliance officers, and organizations seeking verified fraud conviction data
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                org: "Media & Journalism",
                uses: "Investigative reporting and fact-checking"
              },
              {
                org: "Compliance & Risk",
                uses: "Due diligence and background verification"
              },
              {
                org: "Research & Academia",
                uses: "Fraud studies and trend analysis"
              }
            ].map((item, idx) => (
              <div key={idx} className={`p-8 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{item.org}</h3>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>{item.uses}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
