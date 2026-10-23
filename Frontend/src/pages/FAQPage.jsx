import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FACTS, OPERATORS } from "../lib/facts";

const FAQPage = ({ isDark }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const headingClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const bgClass = isDark ? "bg-slate-800" : "bg-gray-50";
  const borderClass = isDark ? "border-slate-700" : "border-gray-200";

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is FraudCheckr?",
          a: `FraudCheckr makes the fraud conviction records published by Nigeria's Economic and Financial Crimes Commission (EFCC) searchable. It holds ${FACTS.recordsLabel} records from the EFCC's Narrative of Convictions tables for ${FACTS.yearsLabel}. It is run by ${OPERATORS} and is not affiliated with the EFCC or any court.`
        },
        {
          q: "Is FraudCheckr free to use?",
          a: "Yes. Searching and browsing records and statistics is free and needs no account. A paid API is available for organisations that need programmatic access; see the Developers page."
        },
        {
          q: "How do I search for records?",
          a: "Type a name into the search bar. Partial names and recorded aliases are matched, and capitalisation does not matter. The Insights page shows patterns across all records."
        }
      ]
    },
    {
      category: "Data & Accuracy",
      questions: [
        {
          q: "Where does the data come from?",
          a: `Only from the EFCC's Narrative of Convictions tables for ${FACTS.yearsLabel}, which list convictions the EFCC secured in Federal, State and FCT High Courts. We do not add records from other sources.`
        },
        {
          q: "How accurate is the data?",
          a: "Records are as accurate as the EFCC's tables. We fix problems introduced when the tables were extracted from PDFs, such as swapped columns and misread dates, and we flag anything we could not resolve. We have not checked each record against court files, and a record does not show whether a conviction was later overturned on appeal. Confirm important details with the court registry."
        },
        {
          q: "Does a matching name mean someone was convicted?",
          a: "No. Many people share names. A record shows that the EFCC reported a conviction of someone with that name. To link it to a particular person, match the charge number, court and date with the court registry."
        },
        {
          q: "If I find no record, does that mean a person has no conviction?",
          a: `No. FraudCheckr only covers convictions listed in the EFCC's tables for ${FACTS.yearsLabel}. It does not cover other agencies, other years, or cases the EFCC did not list.`
        },
        {
          q: "How often is the data updated?",
          a: "We add each new EFCC table after it is published. The EFCC publishes these tables periodically, so recent convictions may not appear yet."
        }
      ]
    },
    {
      category: "Privacy",
      questions: [
        {
          q: "Do you keep a record of my searches?",
          a: "You do not need an account to search. Like most websites, our hosting provider keeps short-term technical logs, including IP addresses and the pages requested (which can include search terms), for security and troubleshooting. The Privacy Policy explains what we keep and for how long."
        },
        {
          q: "Do you use cookies or tracking?",
          a: "No. We do not use advertising or analytics trackers. Your browser stores your light/dark theme choice, and, if you use the developer dashboard, your sign-in session."
        },
        {
          q: "Why do you publish people's names?",
          a: "Conviction records are published by the EFCC as a matter of public accountability, and names are what make them searchable. We limit what we publish to what that purpose needs: we leave out victims' names, where a convict is held and their expected release date."
        }
      ]
    },
    {
      category: "Responsible Use",
      questions: [
        {
          q: "Can I use this for background checks?",
          a: "FraudCheckr is a research tool, not a background-check service. Do not make decisions about a person, such as hiring, lending or tenancy, based on a FraudCheckr record alone. If a record seems relevant, confirm it with the court and give the person a chance to respond."
        },
        {
          q: "What if I find information about myself?",
          a: "Contact us with the record ID shown on the record. We will review your request and correct, add context to, or remove the record where that is warranted, for example if it is wrong, is not about you but is being confused with you, or the conviction was overturned. The Disclaimer page explains the process."
        },
        {
          q: "What uses are not allowed?",
          a: "Harassment, threats, discrimination, publishing records out of context to shame someone, and any use that breaks the law. See the Terms of Service."
        }
      ]
    },
    {
      category: "API & Developers",
      questions: [
        {
          q: "How do I get API access?",
          a: "Create a developer account on the Developers page, choose a plan and pay through Paystack, then create an API key from your dashboard."
        },
        {
          q: "What plans are available?",
          a: "Current plans, prices and limits are listed on the Developers page."
        },
        {
          q: "Are there rate limits?",
          a: "Yes. Each API key has a per-minute request limit. If you exceed it, the API returns a rate-limit response telling you when to retry."
        },
        {
          q: "What languages does the API support?",
          a: "It is a REST API, so any language that can make HTTP requests works. The documentation includes examples."
        }
      ]
    },
    {
      category: "Support & Billing",
      questions: [
        {
          q: "How do I contact you?",
          a: "Use the details on the Contact page."
        },
        {
          q: "The search returned no results. Why?",
          a: "The name may be spelled differently in the EFCC's tables, or the person may not be in them. Try a surname on its own or another spelling."
        },
        {
          q: "How do I pay?",
          a: "Payments are processed by Paystack. The payment methods available to you are shown at checkout."
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes. You keep access until the end of the period you have paid for."
        },
        {
          q: "Do you offer refunds?",
          a: "If you were billed incorrectly or the service was unavailable for a significant part of your billing period, contact us and we will review it."
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-10 h-10 text-blue-500" />
            <h1 className={`text-4xl md:text-5xl font-bold ${headingClass}`}>
              Frequently Asked Questions
            </h1>
          </div>
          <p className={`text-xl ${textSecondaryClass}`}>
            Find answers to common questions about FraudCheckr
          </p>
        </div>

        {/* FAQs by Category */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category Title */}
              <h2 className={`text-3xl font-bold ${headingClass} mb-6 pb-3 border-b-2 border-blue-500`}>
                {category.category}
              </h2>

              {/* Category Questions */}
              <div className="space-y-4">
                {category.questions.map((item, index) => {
                  const globalIndex = `${categoryIndex}-${index}`;
                  const isOpen = activeIndex === globalIndex;

                  return (
                    <details
                      key={globalIndex}
                      className={`group rounded-lg border p-6 cursor-pointer transition-all ${
                        isDark
                          ? "bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                          : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                      open={isOpen}
                    >
                      <summary
                        onClick={() => toggleFAQ(globalIndex)}
                        className={`flex justify-between items-center font-semibold cursor-pointer ${headingClass}`}
                      >
                        <span className="text-lg">{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </summary>
                      <div
                        className={`mt-4 ${textSecondaryClass} leading-relaxed overflow-hidden transition-all`}
                        style={{
                          maxHeight: isOpen ? "500px" : "0",
                          opacity: isOpen ? 1 : 0
                        }}
                      >
                        {item.a}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className={`mt-20 p-8 rounded-lg border-2 border-blue-500 ${isDark ? "bg-blue-500/10" : "bg-blue-50"} text-center`}>
          <h3 className={`text-2xl font-bold ${headingClass} mb-3`}>
            Still have questions?
          </h3>
          <p className={`${textSecondaryClass} mb-6`}>
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
