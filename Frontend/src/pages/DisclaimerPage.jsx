import React from "react";
import { AlertTriangle } from "lucide-react";
import LegalDocument from "../components/LegalDocument";
import { FACTS, OPERATORS } from "../lib/facts";

const UPDATED = "23 October 2026";
const METHOD_URL = "https://github.com/Basit-of-Africa/FraudCheckr/blob/master/data/README.md";

const DisclaimerPage = ({ isDark }) => (
  <LegalDocument
    isDark={isDark}
    icon={AlertTriangle}
    title="Disclaimer and Corrections"
    updated={UPDATED}
    intro="Please read this before relying on any FraudCheckr record. It explains what a record does and does not show, how we prepared the data, and how to ask for a correction or removal."
    sections={[
      {
        heading: "Who we are",
        body: [
          `FraudCheckr is an independent research tool operated by ${OPERATORS}. It is not affiliated with, endorsed by or acting for the Economic and Financial Crimes Commission (EFCC), any court or any government body. Nothing on FraudCheckr is legal advice.`,
        ],
      },
      {
        heading: "Where the records come from",
        body: [
          `Every record comes from the EFCC's Narrative of Convictions tables for ${FACTS.yearsLabel}, in which the EFCC lists convictions it secured in Federal, State and FCT High Courts. We do not add records from other sources. The original tables are the authoritative source; for certified information, contact the court that heard the case.`,
        ],
      },
      {
        heading: "What a record shows, and what it does not",
        body: [
          "A record shows that the EFCC reported a conviction of a person or organisation with that name, in that court, on that date.",
          "A record does not:",
          {
            list: [
              "identify a particular person. The EFCC's tables have no dates of birth or ID numbers, and many people share names",
              "show whether the conviction was later overturned on appeal, set aside, or followed by a pardon",
              "show whether a prison term was served, or a fine paid instead",
              "cover convictions outside the EFCC's published tables. No result does not mean a person has no conviction",
            ],
          },
          {
            note: "Do not make a decision about a person based on a FraudCheckr record alone. Confirm the charge number, court and date with the court registry, and give the person a chance to respond.",
          },
        ],
      },
      {
        heading: "How we prepared the data",
        body: [
          "The EFCC's tables were extracted from PDFs and contained errors introduced along the way. We corrected those we could establish from the data itself, such as columns that had slipped, dates whose day and month had been swapped, and names that had been split or merged. The sentence is always shown exactly as the EFCC recorded it.",
          "Where we could not be sure, we did not guess. The record carries a quality note instead, for example when a court was worked out from the charge number, or when the sentence text mentions an acquittal although the EFCC lists the case as a conviction.",
          `We have not checked each record against court files. Our full method, and every correction rule, is published in the [dataset documentation](${METHOD_URL}).`,
        ],
      },
      {
        id: "corrections",
        heading: "Corrections and removal",
        body: [
          "Anyone can report an error. If you are named in a record, or represent someone who is, you can ask us to correct it, add context to it, or remove it.",
          "Email accuracy@fraudcheckr.com with:",
          {
            list: [
              "the record ID shown on the record (for example FC2024-0848)",
              "what is wrong, and what you believe is correct",
              "any document that supports your request, such as an appeal judgment, a court order or proof that the record is about someone else",
              "if you are asking about a record about yourself, enough information for us to confirm who you are",
            ],
          },
          "What we will do:",
          {
            list: [
              "acknowledge your request within 5 working days",
              "where you show that a record is likely to be wrong, or the conviction was overturned, hide the record from public view while we review it",
              "decide within 30 days and tell you the outcome and our reasons",
            ],
          },
          "Possible outcomes are that we correct the record, add a note to it (for example that an appeal is pending or succeeded), remove it, or keep it unchanged with reasons. We remove records where a conviction has been overturned or set aside, or where a record cannot be reliably separated from someone it is not about.",
          "If you disagree with our decision, reply with any further information and a different member of the team will look at it again. You can also complain to the Nigeria Data Protection Commission; see our [Privacy Policy](/privacy).",
          "When we change or remove a record, the change also applies to the API, and API users must update their copies under our [Terms of Service](/terms).",
        ],
      },
      {
        heading: "Liability",
        body: [
          "We work to keep FraudCheckr accurate, but we cannot guarantee it. Our responsibility to users is set out in the [Terms of Service](/terms).",
        ],
      },
    ]}
  />
);

export default DisclaimerPage;
