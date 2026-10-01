import React from "react";
import { Target, Users, Shield, TrendingUp } from "lucide-react";

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
            Empowering transparency and accountability in financial crime prosecution through accessible, verified conviction data
          </p>
          <p className={`text-base ${textSecondaryClass} max-w-3xl mx-auto mt-4`}>
            FraudCheckr is a conviction-screening and research platform built from public records. It is not a full identity-verification, sanctions-screening, or consumer-credit reporting service.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <Target className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Our Mission</h2>
            <p className={textSecondaryClass}>
              To reduce financial crime by providing journalists, researchers, compliance professionals, and the general public with transparent access to verified fraud conviction records from Nigeria's federal courts. We believe in making official data accessible to everyone.
            </p>
          </div>

          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <TrendingUp className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Our Vision</h2>
            <p className={textSecondaryClass}>
              To become the leading open-source platform for fraud conviction intelligence in Africa, serving as a critical tool for financial integrity and public accountability while maintaining the highest standards of data accuracy and security.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Why Choose FraudCheckr?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Verified Data",
                description: "All conviction records are sourced from official federal court proceedings and documented cases",
                icon: Shield
              },
              {
                title: "Real-time Updates",
                description: "Database is continuously updated with new convictions and case information",
                icon: TrendingUp
              },
              {
                title: "Easy Search",
                description: "Simple, intuitive search interface for finding specific defendants or offense types",
                icon: "🔍"
              },
              {
                title: "Comprehensive Analytics",
                description: "Explore conviction trends, sentencing patterns, and court distributions",
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
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Who Uses FraudCheckr?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                org: "📰 Journalists & Media",
                uses: [
                  "Investigative reporting on financial crimes",
                  "Fact-checking fraud claims",
                  "Writing crime trend analyses"
                ]
              },
              {
                org: "🏢 Compliance Professionals",
                uses: [
                  "Due diligence and background checks",
                  "Regulatory compliance verification",
                  "Risk assessment and mitigation"
                ]
              },
              {
                org: "🎓 Researchers & Academics",
                uses: [
                  "Studying fraud conviction patterns",
                  "Analyzing sentencing trends",
                  "Publishing research and papers"
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
          <h2 className={`text-3xl font-bold ${headingClass} mb-4`}>Our Team</h2>
          <p className={`${textSecondaryClass} max-w-2xl mx-auto`}>
            FraudCheckr is built and maintained by a dedicated team of software engineers, data specialists, and legal experts committed to transparency and accountability. We work closely with federal court records and civil society organizations to ensure data accuracy and integrity.
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Data & Sources</h2>
          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <p className={`${textSecondaryClass} mb-6`}>
              All conviction records in FraudCheckr are sourced from:
            </p>
            <ul className={`space-y-4 ${textSecondaryClass}`}>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Official EFCC Records</strong> - Verified conviction data from the Economic and Financial Crimes Commission</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Court Proceedings</strong> - Public court documents from Federal High Courts across Nigeria</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Legal Publications</strong> - Verified through official legal and regulatory publications</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Public Records</strong> - All data is obtained from publicly available sources</span>
              </li>
            </ul>
            <p className={`${textSecondaryClass} mt-6`}>
              FraudCheckr organizes and normalizes these public records for easier search and screening, but customers should verify critical decisions against official source documents and internal compliance policies.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold ${headingClass} text-center mb-12`}>Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Transparency", desc: "Open access to public information" },
              { title: "Accuracy", desc: "Verified and fact-checked data" },
              { title: "Privacy", desc: "Secure and responsible data handling" },
              { title: "Accessibility", desc: "Free tools for legitimate research" }
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
            Start searching public conviction records today. Our database contains over 864 verified cases across 33 Federal Courts.
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
