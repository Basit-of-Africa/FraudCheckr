import React from "react";
import { Target, Users, Shield, TrendingUp } from "lucide-react";
import { FACTS, OPERATORS } from "../lib/facts";

const AboutPage = ({ isDark }) => {
  const bgClass = isDark ? "bg-slate-900" : "bg-white";
  const cardBgClass = isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200";
  const textColorClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";

  return (
    <div className={`min-h-screen ${bgClass} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className={`text-5xl md:text-6xl font-bold ${headingClass} mb-6`}>
            About FraudCheckr
          </h1>
          <p className={`text-xl ${textSecondaryClass} max-w-3xl mx-auto`}>
            Making the EFCC's published conviction records easy to search, understand and check
          </p>
          <p className={`text-base ${textSecondaryClass} max-w-3xl mx-auto mt-4`}>
            FraudCheckr is an independent public-interest research tool. It is not affiliated with the EFCC or any court, and it is not an identity-verification, background-check, sanctions-screening or credit-reporting service.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <Target className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Why we built it</h2>
            <p className={textSecondaryClass}>
              The EFCC publishes its conviction records each year as long tables extracted from PDFs. They are public, but hard to search and harder to analyse. FraudCheckr turns them into a searchable, documented dataset so journalists, researchers and citizens can follow how financial crime is prosecuted.
            </p>
          </div>

          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <TrendingUp className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>What we aim for</h2>
            <p className={textSecondaryClass}>
              A trustworthy public record of fraud convictions in Nigeria: accurate to its source, open about its limits, and fair to the people named in it.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>How we handle the data</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "One public source",
                description: `Every record comes from the EFCC's Narrative of Convictions tables (${FACTS.yearsLabel}) and links back to its table and row.`,
                icon: Shield
              },
              {
                title: "Cleaned, not altered",
                description: "We fix extraction errors such as swapped columns and misread dates, and flag anything uncertain. The original sentence text is always kept.",
                icon: TrendingUp
              },
              {
                title: "Checkable",
                description: `${FACTS.withChargeNumberPct}% of records carry the court charge number, so anyone can confirm a record with the court registry.`,
                icon: "🔍"
              },
              {
                title: "Careful about people",
                description: "We do not publish victims' names, where convicts are held or their release dates. People named can ask for corrections.",
                icon: "📊"
              }
            ].map((feature, idx) => {
              const Icon = typeof feature.icon === "string" ? null : feature.icon;
              return (
                <div key={idx} className={`p-8 rounded-2xl border ${cardBgClass}`}>
                  {Icon ? (
                    <Icon className="w-10 h-10 text-blue-500 mb-4" />
                  ) : (
                    <span className="text-3xl mb-4 block">{feature.icon}</span>
                  )}
                  <h3 className={`text-xl font-bold ${headingClass} mb-3`}>{feature.title}</h3>
                  <p className={textSecondaryClass}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Who it's for</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                org: "📰 Journalists & Media",
                uses: [
                  "Reporting on fraud prosecutions",
                  "Fact-checking claims about convictions",
                  "Analysing trends by offence and court"
                ]
              },
              {
                org: "🤝 Civil Society",
                uses: [
                  "Monitoring enforcement outcomes",
                  "Tracking sentencing patterns",
                  "Public education on fraud"
                ]
              },
              {
                org: "🎓 Researchers & Academics",
                uses: [
                  "Studying fraud conviction patterns",
                  "Analysing sentencing outcomes",
                  "Citing a documented dataset"
                ]
              }
            ].map((item, idx) => (
              <div key={idx} className={`p-8 rounded-2xl border ${cardBgClass}`}>
                <h3 className={`text-xl font-bold ${headingClass} mb-4`}>{item.org}</h3>
                <ul className={`space-y-3 ${textSecondaryClass}`}>
                  {item.uses.map((use, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-blue-500">✓</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Team/Organization */}
        <div className={`p-12 rounded-2xl border text-center mb-20 ${cardBgClass}`}>
          <Users className="w-16 h-16 mx-auto text-blue-500 mb-6" />
          <h2 className={`text-3xl font-bold ${headingClass} mb-4`}>Who runs FraudCheckr</h2>
          <p className={`${textSecondaryClass} max-w-2xl mx-auto`}>
            FraudCheckr is built and operated by {OPERATORS}.
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Data & Sources</h2>
          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <p className={`${textSecondaryClass} mb-6`}>
              FraudCheckr has one source:
            </p>
            <ul className={`space-y-4 ${textSecondaryClass}`}>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>EFCC Narrative of Convictions, {FACTS.yearsLabel}</strong>: the yearly tables in which the Economic and Financial Crimes Commission reports convictions it secured. They cover {FACTS.courts} Federal, State and FCT High Courts in {FACTS.placesLabel}.</span>
              </li>
            </ul>
            <p className={`${textSecondaryClass} mt-6`}>
              We have not checked each record against court files. Records show what the EFCC reported at the time of conviction and may not reflect later appeals. Before relying on a record about a particular person, confirm it with the court registry.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Transparency", desc: "Open access to public information" },
              { title: "Accuracy", desc: "Faithful to the source, with problems flagged" },
              { title: "Fairness", desc: "Corrections and context for people named" },
              { title: "Accessibility", desc: "Free search for everyone" }
            ].map((value, idx) => (
              <div key={idx} className={`text-center`}>
                <h3 className={`text-xl font-bold ${headingClass} mb-2`}>{value.title}</h3>
                <p className={textSecondaryClass}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`bg-blue-600/20 border ${isDark ? "border-blue-700/30" : "border-blue-300/30"} p-12 rounded-2xl text-center`}>
          <h2 className={`text-3xl font-bold ${headingClass} mb-4`}>Ready to Explore?</h2>
          <p className={`${textSecondaryClass} mb-8 max-w-2xl mx-auto`}>
            Search {FACTS.recordsLabel} conviction records from {FACTS.courts} courts in {FACTS.placesLabel}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/search?name=" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Search Records
            </a>
            <a href="/insights" className={`px-8 py-3 font-semibold rounded-lg transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}`}>
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
