import React from "react";
import { Lock } from "lucide-react";
import LegalDocument from "../components/LegalDocument";
import { FACTS, OPERATORS } from "../lib/facts";

const UPDATED = "23 October 2026";

const PrivacyPage = ({ isDark }) => (
  <LegalDocument
    isDark={isDark}
    icon={Lock}
    title="Privacy Policy"
    updated={UPDATED}
    intro={`This policy explains what personal data FraudCheckr processes, why, and what rights you have. It covers two groups of people: people who use FraudCheckr, and people named in the conviction records it publishes. It is written to meet the Nigeria Data Protection Act 2023 (NDPA).`}
    sections={[
      {
        heading: "Who we are",
        body: [
          `FraudCheckr is operated jointly by ${OPERATORS} ("we", "us"). We decide together how and why personal data on FraudCheckr is processed, and we are jointly responsible for it as data controllers under the NDPA.`,
          "For anything in this policy, or to exercise your rights, email privacy@fraudcheckr.com. Our address is FraudCheckr Team, Lagos, Nigeria.",
        ],
      },
      {
        heading: "People named in conviction records",
        body: [
          `FraudCheckr republishes conviction records from the Economic and Financial Crimes Commission's (EFCC) Narrative of Convictions tables for ${FACTS.yearsLabel}. We did not collect this information from the people named; it comes from the EFCC's publications.`,
          "What we publish about each convicted person or organisation:",
          {
            list: [
              "name and any recorded alias, and the names of co-defendants in the same case",
              "charge number, offence, court, presiding judge, and the dates the charge was filed and the conviction made",
              "the sentence as recorded, including any term, fine, restitution or forfeiture",
              "the EFCC zone that reported the case, and the table and row the record came from",
            ],
          },
          "What we deliberately do not publish, although it appears in the EFCC's tables: the names of complainants (who are often victims), the correctional facility where a person is held, and their expected date of release.",
          "Why we publish it (lawful basis): legitimate interests (NDPA section 25(1)(b)(v)). The interest is public accountability for the prosecution of financial crime: helping journalists, researchers and citizens find and analyse convictions the EFCC has already made public. We have weighed this against the interests of the people named. That is why we publish only what that purpose needs, show the source of every record, flag uncertain information, warn readers that a name match does not identify a person, and give people named a way to have records corrected, annotated or removed.",
          "Although criminal-conviction information is not in the NDPA's list of sensitive personal data, we handle it with the same care.",
          "How long we keep it: as long as the record remains relevant to public understanding of fraud prosecutions. We review records when someone asks us to, and remove or annotate them when, for example, a conviction is overturned on appeal. See the corrections process on our [Disclaimer page](/disclaimer#corrections).",
        ],
      },
      {
        heading: "People who use FraudCheckr",
        body: [
          "Searching and browsing: you do not need an account. Our hosting provider keeps technical logs for security and troubleshooting. These include your IP address, browser details, the time and the address of each page requested, which can include what you searched for. We keep these logs for no longer than 30 days. If request limits are switched on, we briefly keep a count of requests from each IP address to stop abuse. Lawful basis: legitimate interests in keeping the service secure and working.",
          "Developer accounts: if you create one, we keep your email address, a securely hashed version of your password, sign-in sessions, your API keys (stored only in hashed form), your usage counts, and your subscription and payment references. Lawful basis: performance of our contract with you.",
          "Name-match reports: when you run a report through the API, we save the name, aliases, location and reference you submit, together with the results, in your account so you can see them again. You are responsible for having a lawful reason to search for the people you look up. Lawful basis: performance of our contract with you.",
          "Payments: Paystack processes payments. We never see or store your card details. We keep payment references, amounts and dates as tax and accounting law requires. Lawful basis: contract and legal obligation.",
          "Contacting us: if you email us, we keep the correspondence for as long as needed to deal with it and any follow-up. Lawful basis: legitimate interests in answering you, or legal obligation where you are exercising your rights.",
          "We delete developer account data within 12 months of an account being closed, except payment records we must keep for longer by law.",
        ],
      },
      {
        heading: "Cookies and browser storage",
        body: [
          "We do not use advertising or analytics cookies or trackers. Your browser stores your light/dark theme choice and, if you use the developer dashboard, your sign-in session and API key, so you stay signed in. You can clear these at any time in your browser settings.",
        ],
      },
      {
        heading: "Who we share data with",
        body: [
          "We do not sell personal data. We share it only with service providers that run FraudCheckr for us, under contracts that require them to protect it:",
          {
            list: [
              "Vercel, which hosts the website and API",
              "Neon, which hosts our database",
              "Paystack, which processes payments",
            ],
          },
          "We may also disclose data where the law requires it, or to establish, exercise or defend legal claims.",
          "Some of these providers store data outside Nigeria. Where they do, we rely on the transfer safeguards the NDPA allows (sections 41 to 43), such as contractual protections.",
        ],
      },
      {
        heading: "Automated decisions",
        body: [
          "FraudCheckr does not make decisions about anyone. Name-match reports are produced automatically by comparing names, but they only list possible matches for a person to review. We tell users not to make decisions about individuals based on a name match alone.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under the NDPA you can ask us to:",
          {
            list: [
              "tell you whether we hold data about you, give you a copy, and say where it came from",
              "correct data that is inaccurate or incomplete",
              "delete data, where there is no overriding reason to keep it",
              "restrict how we use your data while a concern is looked into",
              "stop processing your data, where we rely on legitimate interests and your situation outweighs them",
              "give you data you provided to us in a portable format",
              "withdraw consent, where we rely on it",
            ],
          },
          "Email privacy@fraudcheckr.com. We may ask you to confirm your identity. We will respond within 30 days. If you are named in a record, quote its record ID; the [corrections process](/disclaimer#corrections) explains what happens next.",
          "If you are unhappy with how we handle your data, you can complain to the Nigeria Data Protection Commission (ndpc.gov.ng). We would appreciate the chance to put things right first.",
        ],
      },
      {
        heading: "Security",
        body: [
          "All connections to FraudCheckr use HTTPS. Passwords and API keys are stored only in hashed form, and access to our systems is limited to the people who run the service. No system is perfectly secure. If a breach is likely to put people at risk, we will notify the Nigeria Data Protection Commission within 72 hours of becoming aware of it, and tell the people affected without undue delay.",
        ],
      },
      {
        heading: "Children",
        body: [
          "FraudCheckr is not intended for children under 18, and we do not knowingly collect their data through the website or API.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "If we change this policy, we will update the date at the top. If the change is significant, we will also post a notice on the site and email developer account holders.",
        ],
      },
    ]}
  />
);

export default PrivacyPage;
