import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

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
          a: "FraudCheckr is a web platform that provides searchable access to publicly available fraud conviction records from Nigeria's Federal High Courts. Our database contains over 7,788 verified conviction records spanning 2020-2024."
        },
        {
          q: "Is FraudCheckr free to use?",
          a: "Yes! The web search interface is completely free for all users. You can search, filter, and view conviction records at no cost. We also offer paid API access for developers and organizations needing programmatic access."
        },
        {
          q: "How do I search for records?",
          a: "Simply enter a defendant's name in the search bar and click 'Search'. FraudCheckr supports partial matches and is case-insensitive. You can also use our Insights page to view statistics and filter by offense type or court."
        }
      ]
    },
    {
      category: "Data & Accuracy",
      questions: [
        {
          q: "How accurate is your data?",
          a: "All conviction records are sourced from official Federal High Court proceedings and public records. While we strive for 100% accuracy, we recommend verifying critical information with official court sources before making important decisions."
        },
        {
          q: "What years does the data cover?",
          a: "Our database currently covers fraud convictions from Nigeria's federal courts spanning 2020-2024. We continuously update our records as new cases are finalized. For historical records before 2020, please contact the relevant federal courts directly."
        },
        {
          q: "Can I download all the data?",
          a: "The CSV file is available for download from our GitHub repository. For bulk data access or custom exports via API, please check our API pricing page or contact support."
        },
        {
          q: "How often is the data updated?",
          a: "We update our database regularly as new convictions are recorded. Major updates occur monthly, though there may be delays in official data release. Critical updates are noted in our changelog."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "Is my search history private?",
          a: "Yes. We don't store personal search histories or track individual users across sessions. Your IP address is logged for security purposes only. See our Privacy Policy for details."
        },
        {
          q: "Is the data I search on FraudCheckr secure?",
          a: "Absolutely. All data transmission is encrypted via HTTPS. We don't store personal information from searches, and our servers are protected by industry-standard security measures."
        },
        {
          q: "Can I be identified on FraudCheckr?",
          a: "No. Searches on FraudCheckr are anonymous. We don't require registration or login for public access. Paid API users do provide credentials, which are securely stored."
        }
      ]
    },
    {
      category: "Legal Use & Responsible Access",
      questions: [
        {
          q: "Is it legal to use this data?",
          a: "Yes. All conviction records are public information from official court proceedings. However, you must use this data responsibly and legally. Prohibited uses include harassment, discrimination, or unauthorized background checks for discriminatory purposes."
        },
        {
          q: "Can I use this for background checks?",
          a: "FraudCheckr is intended for research, journalism, compliance, and legitimate business purposes. Employment background checks should follow legal guidelines (FCRA in the US). Always get consent and follow local employment laws."
        },
        {
          q: "What if I find information about myself?",
          a: "If you believe information is inaccurate or needs updating, please reach out to us or contact the relevant federal court. We take data accuracy seriously and will investigate disputes."
        }
      ]
    },
    {
      category: "API & Developers",
      questions: [
        {
          q: "How do I get API access?",
          a: "Create a developer account, complete Paystack checkout, and then rotate your live API key from the developer dashboard. FraudCheckr currently offers a single paid developer plan for screening and conviction-search access."
        },
        {
          q: "What are the rate limits?",
          a: "Paid API keys are protected by platform rate limits and abuse controls. If you exceed the current request threshold, FraudCheckr temporarily throttles requests and returns a rate-limit response so your integration can retry safely."
        },
        {
          q: "Can I use the API commercially?",
          a: "Yes. Paid API subscriptions can be used for commercial purposes. Please review our Terms of Service for usage guidelines and restrictions."
        },
        {
          q: "What programming languages are supported?",
          a: "Our REST API works with any language that can make HTTP requests (Python, JavaScript, Java, PHP, Go, Ruby, etc.). We provide code examples in Python and JavaScript."
        }
      ]
    },
    {
      category: "Support & Troubleshooting",
      questions: [
        {
          q: "How do I contact support?",
          a: "You can reach us via email (support@fraudcheckr.com), phone (+234-800-000-0000), or our contact form. We respond within 24-48 hours."
        },
        {
          q: "The search returned no results. Why?",
          a: "Possible reasons: 1) The name might not be exact, 2) The defendant's record may not be in our database, 3) Check spelling and try partial names. Visit our search tips for more help."
        },
        {
          q: "I'm getting an API error. What should I do?",
          a: "Check the API documentation for error codes. Common issues: invalid API key, rate limit exceeded, malformed request. Email api@fraudcheckr.com with error details for assistance."
        },
        {
          q: "Is the site down? Why can't I access it?",
          a: "Check your internet connection first. You can also check our status page (status.fraudcheckr.com) for live updates. Contact support if the issue persists."
        }
      ]
    },
    {
      category: "Pricing & Billing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit cards (Visa, Mastercard, Amex), bank transfers, and mobile money platforms (MTN, Airtel, GLO). Details are available at checkout."
        },
        {
          q: "Do you offer refunds?",
          a: "Refunds are reviewed case by case. If you believe you were billed incorrectly or the service was materially unavailable, contact billing support so we can investigate."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes! You can cancel anytime. There's no lock-in contract. You'll retain access until the end of your billing period."
        },
        {
          q: "Is there a free trial for API access?",
          a: "FraudCheckr does not currently advertise a public API free trial. If you need an evaluation workflow for your team, contact sales support before subscribing."
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
