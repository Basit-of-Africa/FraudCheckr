import React from "react";
import { FileText } from "lucide-react";
import LegalDocument from "../components/LegalDocument";
import { FACTS, OPERATORS } from "../lib/facts";

const UPDATED = "23 October 2026";

const TermsPage = ({ isDark }) => (
  <LegalDocument
    isDark={isDark}
    icon={FileText}
    title="Terms of Service"
    updated={UPDATED}
    intro={`These terms apply to everyone who uses FraudCheckr, the website and the API. FraudCheckr is operated by ${OPERATORS} ("we", "us"). By using it, you agree to these terms. If you do not agree, please do not use FraudCheckr.`}
    sections={[
      {
        heading: "What FraudCheckr is",
        body: [
          `FraudCheckr is a public-interest research tool. It republishes conviction records from the EFCC's Narrative of Convictions tables for ${FACTS.yearsLabel}, cleaned and organised so they can be searched and analysed.`,
          "FraudCheckr is not affiliated with the EFCC or any court. It is not an identity-verification, background-check, credit-reporting, watchlist or sanctions-screening service, and it does not give legal advice.",
        ],
      },
      {
        heading: "Using the website",
        body: [
          "You may search, read and share records on the website free of charge, for any lawful purpose, including journalism, research, teaching and public-interest work.",
          "When you quote or republish a record, cite FraudCheckr and the record ID, keep the charge number, court and date with the name, and do not present the record as more certain than it is (for example by dropping its quality notes).",
          "Do not copy the website in bulk by scraping or automated downloading. If you need the data at scale, use the API.",
        ],
      },
      {
        heading: "Things you must not do",
        body: [
          {
            list: [
              "make a decision about a person, such as hiring, lending, renting, onboarding or refusing a service, based only on a name match in FraudCheckr, without confirming the record with the court and giving the person a chance to respond",
              "use FraudCheckr to harass, threaten, shame, blackmail or discriminate against anyone",
              "combine FraudCheckr records with other data to build profiles of individuals who are not the subject of genuine research or reporting",
              "republish a record after we have told you it was corrected or removed",
              "try to get around security measures, rate limits or access controls, or interfere with the service",
              "use FraudCheckr in any way that breaks the law",
            ],
          },
        ],
      },
      {
        heading: "Accuracy",
        body: [
          "Records are only as accurate as the EFCC's tables. We correct errors introduced when the tables were extracted, flag what we could not resolve, and explain our method on the [Disclaimer page](/disclaimer). We have not checked each record against court files.",
          "A record shows what the EFCC reported at the time of conviction. It may not reflect a later appeal, pardon or other change, and a name match does not identify a particular person. You are responsible for checking any record you rely on with the court.",
        ],
      },
      {
        heading: "Developer accounts and the API",
        body: [
          "To use the API you need a developer account, a plan, and an API key. Keep your password and keys secret; you are responsible for activity under your account. Tell us at once if you think a key has been compromised, and rotate it from your dashboard.",
          "API use is subject to the limits of your plan and to per-minute rate limits. We may throttle or suspend access that threatens the service or breaks these terms.",
          "You may use API data in your own products and publications, including commercially, subject to these terms. Where you display records, show the record ID, source reference and quality notes, and refresh your copy at least every 30 days so corrections and removals reach your users.",
        ],
      },
      {
        heading: "Plans, payment and cancellation",
        body: [
          "Plans, prices and limits are shown on the Developers page. Paid plans are billed in advance through Paystack, in Naira, for each billing period.",
          "You can cancel at any time and keep access until the end of the period you have paid for. We do not normally refund partial periods. If you were billed incorrectly, or the service was unavailable for a significant part of a period, contact us and we will review it.",
          "We will give at least 30 days' notice of a price change before it applies to your next billing period.",
        ],
      },
      {
        heading: "Our content",
        body: [
          "The underlying conviction records are public information published by the EFCC. Our cleaning, organisation, record IDs, quality notes, statistics, software and site design belong to us. You may use them as these terms allow; for other reuse, contact us.",
        ],
      },
      {
        heading: "No warranty",
        body: [
          'FraudCheckr is provided "as is" and "as available". To the extent the law allows, we make no promise that it will be accurate, complete, current, uninterrupted or free of errors.',
        ],
      },
      {
        heading: "Limits on our liability",
        body: [
          "To the extent the law allows, we are not liable for any loss arising from reliance on a FraudCheckr record, or for indirect or consequential loss, lost profit or lost data. Our total liability to you for any claim is limited to the fees you paid us in the 12 months before the claim arose, or ₦50,000 if you have not paid us anything.",
          "Nothing in these terms limits liability that cannot be limited by law.",
        ],
      },
      {
        heading: "Your responsibility for misuse",
        body: [
          "If someone brings a claim against us because you used FraudCheckr in breach of these terms or the law, you agree to cover our reasonable losses and costs arising from that claim.",
        ],
      },
      {
        heading: "Suspension and termination",
        body: [
          "We may suspend or close an account that breaks these terms, after giving notice where that is reasonable. You can close your account at any time.",
        ],
      },
      {
        heading: "Changes to these terms",
        body: [
          "We may update these terms. We will change the date at the top and, for significant changes, give developer account holders at least 30 days' notice by email. Continuing to use FraudCheckr after a change takes effect means you accept it.",
        ],
      },
      {
        heading: "Law and disputes",
        body: [
          "These terms are governed by the laws of the Federal Republic of Nigeria, and the Nigerian courts have jurisdiction over any dispute. Please contact us first; most problems can be settled informally.",
          "Questions about these terms: legal@fraudcheckr.com.",
        ],
      },
    ]}
  />
);

export default TermsPage;
