
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { Search, BarChart3, Globe } from "lucide-react";
import { FACTS } from "../lib/facts";

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
              From the EFCC's published conviction records
            </p>
            <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Fraud<span className={isDark ? "text-blue-400" : "text-blue-600"}>Checkr</span>
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed mb-12 max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Search and explore fraud conviction records published by Nigeria's Economic and Financial Crimes Commission, covering convictions reported for {FACTS.yearsLabel}.
            </p>
            
            <div className="mb-16">
              <SearchBar isDark={isDark} />
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { label: `${FACTS.recordsLabel} records`, icon: "📊" },
                { label: `${FACTS.courts} courts`, icon: "⚖️" },
                { label: `${FACTS.yearsLabel} EFCC tables`, icon: "📅" }
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
              What you can do
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Look up a name, read the record as the EFCC reported it, and explore patterns across the whole dataset
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Search by name",
                description: "Find records by defendant name or recorded alias. Partial names work."
              },
              {
                icon: BarChart3,
                title: "Explore patterns",
                description: "See how convictions break down by offence, court and sentence across the dataset"
              },
              {
                icon: Globe,
                title: "Nationwide",
                description: `Federal, State and FCT High Courts in ${FACTS.placesLabel}`
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
                description: `Enter a name to search ${FACTS.recordsLabel} conviction records`
              },
              {
                step: 2,
                title: "Check",
                description: "Read the offence, court, charge number, date and sentence. A name alone does not identify a person; confirm details with the court."
              },
              {
                step: 3,
                title: "Analyze",
                description: "Explore offences, courts and sentences across Nigeria"
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
              { label: "Conviction records", value: FACTS.recordsLabel },
              { label: "Courts", value: FACTS.courts },
              { label: "Offence categories", value: FACTS.offenceCategories },
              { label: "EFCC tables", value: FACTS.yearsLabel }
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
            Start exploring
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Searching and browsing the records is free, with no account needed.
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
                q: "Where does the data come from?",
                a: `From the conviction tables the EFCC publishes each year (Narrative of Convictions, ${FACTS.yearsLabel}). We clean and organise those tables but do not add records from other sources. FraudCheckr is independent and is not affiliated with the EFCC.`
              },
              {
                q: "How current is the data?",
                a: `It covers the EFCC tables for ${FACTS.yearsLabel}. We add new tables after the EFCC publishes them. A record shows the position at conviction and may not reflect a later appeal.`
              },
              {
                q: "Can I use the data in my own work?",
                a: "Yes. You can search and cite records on this site for free. Researchers and newsrooms that need programmatic access can use the API described on the Developers page."
              },
              {
                q: "Does a matching name mean someone was convicted?",
                a: "No. Many people share names. Before relying on a record about a particular person, match the charge number, court and date with the court registry. Never use a name match alone to make a decision about someone."
              },
              {
                q: "What if a record is wrong or about me?",
                a: "Tell us using the contact details on the Contact page, quoting the record ID. We review every request and correct, annotate or remove records where that is warranted. The Disclaimer page explains the process."
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
            Who it's for
          </h2>
          <p className={`text-center mb-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Built for public-interest research into financial crime in Nigeria
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                org: "Media & Journalism",
                uses: "Reporting and fact-checking on fraud prosecutions"
              },
              {
                org: "Civil society",
                uses: "Monitoring enforcement and sentencing outcomes"
              },
              {
                org: "Research & Academia",
                uses: "Studying offences, courts and sentencing trends"
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
