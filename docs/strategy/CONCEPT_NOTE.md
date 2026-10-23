# Nigeria Public Records Layer: Concept Note

*As of 23 October 2026. Draft for discussion by UpNawt Studio and Synergia Systems Ltd.*
*Implementation detail: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).*

## Executive summary

We propose to build the Nigerian legal and enforcement records layer that KYC platforms, banks and lenders need but nobody has organised, and to sell it through the platforms they already use.

- **The gap.** Identity verification and global sanctions screening are already a crowded market in Nigeria. Structured local data on prosecutions, lawsuits and regulator actions is not.
- **The asset.** A linked record of people, companies, cases and enforcement actions, built from public sources, with every record traceable to its source and open to correction.
- **The route to market.** A data feed into existing KYC platforms first, so one integration reaches many fintechs. Then monitoring alerts and due-diligence reports.
- **The starting point.** FraudCheckr already turns the EFCC's 2020 to 2024 conviction tables into a clean, documented, searchable dataset. It stays free and public, as the trust signal and the channel for corrections.
- **The first test.** Fifteen interviews with fintech compliance officers, to confirm that local adverse checks are done by hand today and that teams would pay for a pilot.

## The problem

Nigerian compliance teams cannot systematically check whether a customer, director or counterparty has been prosecuted, sued or sanctioned in Nigeria.

- **The records are scattered.** Convictions sit in EFCC tables and press releases; regulator actions in SEC, CBN and FCCPC notices; court cases in registries that are still largely paper-based.
- **The records are hard to use.** They are published as PDFs and press statements, with inconsistent names, dates and formats.
- **Names are not enough.** Most records carry no date of birth or ID number, so a name match alone cannot show that a record is about a particular person.
- **Our working hypothesis:** compliance analysts fill the gap by searching the web by hand, which is slow, inconsistent and impossible to audit. This is the first thing to test (see [Validation plan](#validation-plan)).

## The opportunity

The opening is to supply Nigerian enforcement and court data to the KYC platforms, not to compete with them.

Identity checks and global sanctions and politically-exposed-person screening are already sold in Nigeria by [Youverify](https://youverify.co/en/blogs/kyc-service-provider-nigerian-banks), [Smile ID](https://usesmileid.com/countries/nigeria), Prembly and others, often bundled with adverse-media checks. None clearly offers structured local enforcement and litigation data. Youverify's own [guide to screening data sources](https://youverify.co/en/blogs/aml-screening-data-sources) names court records and EFCC notices as useful sources, but does not say it uses them.

Two trends make the timing right:

- **Regulatory pressure.** The CBN's [Customer Due Diligence Regulations 2023](https://www.CBN.gov.ng/Out/2023/CCD/CBN%20Customer%20Due%20diligence%20Reg.%202023-combined.pdf) raise expectations on banks and fintechs to know who they are dealing with.
- **Courts going digital.** The Federal High Court began [electronic filing in Lagos in 2026](https://www.thisdaylive.com/2026/04/28/federal-high-court-launches-e-filing-system-ushers-in-digital-justice-era-in-lagos/) as part of a national case-management system. It covers filing, not public access, so far, but it signals that court data will open up.

## The solution

We will build five data layers, starting with the easiest and most valuable, and link them into one record of people, companies, cases and actions.

| Layer | Sources | Value to buyers | Difficulty |
| --- | --- | --- | --- |
| Criminal convictions | EFCC conviction tables (done); EFCC conviction press releases; ICPC convictions (dozens a year, [ICIR](https://www.icirnigeria.org/icpc-recoers-n37-44bn-records-55-74-conviction-rate-in-2025/)) | High | Low to medium |
| Regulator actions | SEC Nigeria investor alerts and sanctions; CBN licence revocations; FCCPC, NAICOM and PenCom actions; procurement debarments | High for fintechs and lenders | Medium: scattered PDFs and notices |
| Corporate links | CAC company records, directors and beneficial-ownership register | Very high: links people to companies | Medium: access terms to confirm |
| Court cases | State cause lists and judgments; law reports; Federal High Court case-management system | Highest: civil fraud, debt recovery, wind-ups | Hardest: mostly paper today |
| Adverse media | Nigerian news outlets, with names and companies extracted automatically | Medium: competitors offer it | Medium: licensing matters |

### Linking records to people

Names alone are the core weakness, so identity is resolved by linking evidence, never by guessing:

- **Link through records.** Court papers, charge sheets and company filings often carry addresses, ages and company roles that tie entries together.
- **Use licensed partners for national IDs.** Bank-grade checks against NIN or BVN go only through licensed verification providers, with the customer's consent at onboarding. We never store national ID data.
- **Show the confidence.** Every link states how sure it is and why, as FraudCheckr's quality flags do today.

## Products and business model

Revenue starts with data licences sold through KYC platforms, with direct products added as the data grows.

| Product | Buyer | How it is sold |
| --- | --- | --- |
| Enforcement and litigation data feed (API) | KYC platforms such as Youverify, Smile ID and Prembly | Licence fee plus per-check pricing; one integration reaches many fintechs |
| Monitoring alerts | Lenders, law firms, procurement units, newsrooms | Subscription per monitored entity: "a director of your counterparty was named in an SEC alert" |
| Due-diligence reports | Investors and businesses vetting partners | Per report, run on companies rather than private individuals |
| FraudCheckr | Public, journalists, researchers | Free: the trust signal, media profile and corrections channel |

**The moat** is not any one source, since each is public. It is the linked history of people, companies and cases, built up over years, plus the corrections loop that keeps it accurate. A competitor can copy a dataset in a quarter; they cannot copy years of linked, corrected records.

## Competitive landscape

The established players are potential channels, not rivals, because none publicly offers structured Nigerian enforcement and court data.

| Player type | Examples | What they cover | Where we fit |
| --- | --- | --- | --- |
| Nigerian KYC platforms | Youverify, Smile ID, Prembly | Identity checks, sanctions and PEP lists, adverse media | Supply the local enforcement and litigation data they lack |
| Global screening data vendors | Large international compliance-data providers | Sanctions, PEP and global adverse media | Local depth they do not build |
| Law-report publishers | Nigerian legal research databases | Reported judgments, for lawyers | Possible data partners for the court layer |
| Public sources | EFCC, ICPC, regulators, courts | Raw notices and tables | We organise, link and correct them |

The main competitive risk is that a large KYC platform builds this itself. Historically, platforms buy data rather than digitise court records, so an early partnership turns that risk into a channel.

## Risks and mitigations

Legal risk is the largest and must be designed in from day one.

| Risk | What could happen | Mitigation |
| --- | --- | --- |
| Credit reporting law | Some background reports may fall under the Credit Reporting Act 2017 | Legal opinion before launching reports; start with data feeds and company-level reports |
| Data protection (NDPA 2023) | Commercial screening needs a different lawful basis from public research | Act as the data processor when banks screen under their anti-money-laundering duties; keep minimisation and corrections from FraudCheckr |
| Defamation | Wrong or outdated records harm named people | Source on every record, confidence on every link, fast corrections, hide-pending-review |
| Data access | Court and regulator data is paper-based, inconsistent or restricted | Start with published sources; formal agreements with judiciaries and law-report publishers |
| Incumbents | A KYC platform builds this itself | Partner early; compete on depth and history, not breadth |
| Sales cycles | Banks take many months to buy | Sell first to KYC platforms and fintechs, who buy faster |

## Roadmap and milestones

The plan runs in three phases over about two years, and each phase starts only when the gate before it is passed. Timings are targets, not commitments.

| Phase | Timing | Build | Gate to pass before the next phase |
| --- | --- | --- | --- |
| 0: Launch | Now to month 3 | Launch FraudCheckr; ingest EFCC and ICPC press releases; link convicts to CAC company records | 15 interviews pass the go test; 10 active users |
| 1: Expand | Months 3 to 9 | Add regulator actions and adverse media; build the first linked record of people and companies | 1 KYC design partner; 2 paid fintech pilots |
| 2: Scale | Months 9 to 24 | Court data partnerships; monitoring alerts; consent-based identity checks via a partner | Recurring data revenue; then raise a seed round |

Phase 0 builds on what exists today; Phase 2's court data and identity partnerships are the slowest and depend on agreements outside our control.

## Validation plan

Before building beyond FraudCheckr, we will interview 15 compliance officers at fintechs and microfinance banks.

**The key question:** "When onboarding a business customer, how do you check whether they or their directors have been prosecuted, sued or sanctioned in Nigeria?"

1. Record the current method, the time each check takes and who does it.
2. Put a cost on that time per month.
3. Ask whether they would join a paid pilot, and at what price.
4. Ask which data layer they would value first.

- **Go:** at least 5 of 15 confirm manual checks, and at least 3 agree to a paid pilot.
- **Stop or rethink:** most say their current KYC provider already covers local enforcement and court data.

## Open decisions and asks

Three decisions are needed before Phase 1 starts.

- [ ] **Lead entity:** UpNawt Studio, Synergia Systems Ltd, or a new company. A separate company is cleaner for investors and limits legal exposure.
- [ ] **Legal expertise:** a lawyer as co-founder or standing adviser. Legal judgement is part of the product, not a support function.
- [ ] **Design partner:** warm introductions to a KYC platform or a fintech compliance team for the first pilot.

## Sources

- [Youverify: AML screening data sources](https://youverify.co/en/blogs/aml-screening-data-sources)
- [Youverify: KYC service provider for Nigerian banks](https://youverify.co/en/blogs/kyc-service-provider-nigerian-banks)
- [Youverify: AML compliance in Nigeria, CBN and NFIU requirements](https://youverify.co/en/blogs/aml-compliance-nigeria-cbn-nfiu-requirements)
- [Smile ID: Nigeria coverage](https://usesmileid.com/countries/nigeria)
- [Smile ID: Adverse media](https://usesmileid.com/glossary/adverse-media)
- [ThisDay: Federal High Court launches e-filing system in Lagos (2026)](https://www.thisdaylive.com/2026/04/28/federal-high-court-launches-e-filing-system-ushers-in-digital-justice-era-in-lagos/)
- [ICIR: ICPC records 55.74% conviction rate in 2025](https://www.icirnigeria.org/icpc-recoers-n37-44bn-records-55-74-conviction-rate-in-2025/)
- [CBN Customer Due Diligence Regulations 2023](https://www.CBN.gov.ng/Out/2023/CCD/CBN%20Customer%20Due%20diligence%20Reg.%202023-combined.pdf)
