# Institutional L1 Competitor Analysis for Tokenisation

Prepared for the Superteam UK bounty: "Business Challenge: Institutional Competitor Analysis"

Date: 4 June 2026

## Executive Summary

Institutional tokenisation is moving from proof-of-concept to production, but the buying criteria are different from most crypto-native infrastructure decisions. Banks, asset managers, transfer agents, custodians, and market makers care less about "maximum decentralisation" in the abstract and more about whether an on-chain asset can be issued, serviced, recovered, restricted, audited, and settled under real regulatory and operational constraints.

The four most relevant L1-style competitors for institutional-grade tokenisation are Ethereum, Solana, Avalanche, and Stellar. They do not compete on the same axis:

| Chain | Best institutional fit | Main advantage | Main gap |
| --- | --- | --- | --- |
| Ethereum | Liquid, broadly distributed tokenised funds and collateral | Deepest RWA/stablecoin liquidity, mature standards, biggest institutional mindshare | Base-layer cost and privacy constraints; production often needs L2s or permissioning overlays |
| Solana | High-velocity tokenised markets, payments-linked assets, internet-scale distribution | Very low fees, high throughput, rich token extensions, strong consumer/stablecoin rails | Fewer canonical institutional tokenisation templates and less proven regulated-asset AUM than Ethereum/Stellar |
| Avalanche | Permissioned institutional networks and consortium workflows | Evergreen/Subnet model gives KYC/KYB, custom gas, EVM, and validator control | Fragmented liquidity and operational complexity across custom chains |
| Stellar | Regulated funds, payments, and simple issuer-controlled assets | Built-in issuer controls and live Franklin Templeton BENJI proof point | Narrower general-purpose DeFi/composability and smaller developer surface than EVM/Solana |

My recommendation: Ethereum remains the default institutional benchmark today. Avalanche is the strongest "private-but-interoperable" institutional network architecture. Stellar is the most proven purpose-built chain for simple regulated asset issuance. Solana is the most attractive challenger where cost, speed, retail-grade UX, stablecoin movement, and eventual always-on secondary market liquidity matter.

For Solana to outperform in institutional tokenisation, it should not position itself only as "faster Ethereum." The stronger position is: Solana is the public market infrastructure for high-frequency, low-cost, compliance-aware assets that need to move like internet money.

## What Institutions Actually Need

Institutional tokenisation buyers usually rank requirements in this order:

| Requirement | Why it matters |
| --- | --- |
| Legal ownership and transfer-agent mapping | The token must map cleanly to a legal record of ownership, not just a bearer asset in a wallet. |
| Compliance controls | KYC, sanctions screening, jurisdictional restrictions, investor suitability, lockups, and transfer restrictions must be enforceable. |
| Custody and recovery | Institutions need qualified custody, key-loss processes, freeze/reissue mechanics, and operational controls. |
| Settlement certainty | Finality, uptime, predictable fees, and low reconciliation overhead matter more than theoretical TPS. |
| Privacy and disclosure | Institutions need selective confidentiality: regulators and issuers need visibility; competitors and the public should not see everything. |
| Liquidity and distribution | Tokenised assets are only useful if they can be used as collateral, traded, redeemed, or moved through existing market infrastructure. |
| Interoperability | Institutions dislike isolated ledgers. Assets must move between custodians, venues, and sometimes chains. |
| Auditability and reporting | Portfolio, NAV, proof-of-reserve, holder, and transaction reporting must be straightforward. |
| Vendor maturity | Asset managers buy complete operating stacks, not only protocols. Transfer agents, custodians, auditors, broker-dealers, and compliance vendors are part of the product. |

## Ethereum

Ethereum is the institutional reference point because the largest public-chain tokenisation examples began there and because EVM tooling is the broadest ecosystem standard. BlackRock's BUIDL launched on Ethereum with Securitize as transfer agent and tokenisation platform. Ethereum also benefits from the most developed token standards and compliance patterns for regulated assets, including ERC-3643/T-REX for identity-aware transfers.

### Strengths

| Dimension | Assessment |
| --- | --- |
| Institutional proof | Very strong. BUIDL and many RWA/stablecoin deployments made Ethereum the default comparison set. |
| Standards | Strong. ERC-20 is universal, while ERC-3643 adds identity and compliance controls for regulated tokens. |
| Liquidity | Strongest among the four. DeFi, stablecoins, custody integrations, and market infrastructure cluster around Ethereum and its L2s. |
| Vendor ecosystem | Strong. Transfer agents, tokenisation platforms, custodians, analytics providers, and audit firms are mature. |
| Composability | Strong, but depends on whether regulated assets allow open composability. |

### Weaknesses

| Weakness | Implication |
| --- | --- |
| Base-layer fees | Many institutional use cases need L2s or private/permitted overlays for predictable cost. |
| Public transparency | Privacy requires additional architecture, which increases complexity. |
| Fragmentation through L2s | Liquidity and settlement can split across mainnet and many L2s. |
| Compliance is not native to the chain | Strong compliance is built at token/application/vendor level, not at Ethereum protocol level. |

### Best use cases

Ethereum is best for institutional assets that benefit from maximum distribution, deep liquidity, and existing EVM standards: tokenised treasury funds, collateral assets, large stablecoins, and products intended to interact with DeFi or multiple custodians.

## Solana

Solana's institutional tokenisation case is improving quickly. Its strongest advantages are low transaction cost, high throughput, fast user experience, and native token extensions that are relevant to regulated assets. Token Extensions can support features such as transfer hooks, confidential transfers, metadata, permanent delegates, and other controls that make tokens more institutionally expressive than a plain SPL token.

Solana's challenge is not raw technology; it is packaging. Institutions need a complete compliance, custody, transfer-agent, reporting, and recovery workflow. Solana has the ingredients, but Ethereum and Stellar currently have clearer proof points for regulated fund issuance.

### Strengths

| Dimension | Assessment |
| --- | --- |
| Cost and speed | Excellent. Solana is well suited for high-frequency or low-ticket tokenised assets where Ethereum base-layer fees are too expensive. |
| User experience | Strong. Fast confirmation and low fees make wallet, payments, and distribution flows feel closer to Web2. |
| Token features | Strong and underrated. Token Extensions support compliance-oriented design patterns such as transfer hooks and confidential transfers. |
| Stablecoin and payment fit | Strong. Solana is already a high-velocity stablecoin network, which matters because tokenised assets often need cash legs. |
| Market structure upside | High. Solana can support tokenised assets that trade or settle frequently, not only static fund shares. |

### Weaknesses

| Weakness | Implication |
| --- | --- |
| Fewer canonical regulated-asset templates | Issuers may need more bespoke engineering and legal/compliance translation. |
| Lower institutional mindshare than Ethereum | Asset managers and banks often start with EVM because vendors and internal teams know it. |
| Public-chain transparency | Confidential transfers help, but selective disclosure and reporting workflows must be productised. |
| Historical reliability concerns | Even if network reliability has improved, institutions will ask for evidence, SLAs from vendors, and incident processes. |
| Non-EVM environment | Some institutions prefer EVM compatibility to reuse Solidity tooling and security review patterns. |

### Best use cases

Solana is best for tokenised assets that require frequent movement, low-cost settlement, or consumer-scale distribution: stablecoin-linked funds, tokenised equities with active market making, loyalty or receivables products with many small holders, tokenised money-market collateral used in trading, and payment-native RWAs.

## Avalanche

Avalanche's institutional pitch is not only the C-Chain. Its most differentiated product is the Evergreen/Subnet architecture: customizable networks for financial institutions with permissioned validators, embedded allow lists, KYC/KYB controls, custom gas tokens, and EVM compatibility. That makes Avalanche attractive for institutions that are not ready to put the full workflow on a public permissionless network.

### Strengths

| Dimension | Assessment |
| --- | --- |
| Permissioning | Excellent. Evergreen Subnets are designed around permissioned access and institutional controls. |
| Customization | Excellent. Institutions can tune validator sets, VM, gas token, compliance rules, and data access. |
| EVM compatibility | Strong. Existing Ethereum tooling can be reused. |
| Privacy and consortium fit | Strong. Custom networks can protect sensitive workflows while preserving some interoperability. |
| Pilot-to-production path | Strong for banks and asset managers that need a controlled environment first. |

### Weaknesses

| Weakness | Implication |
| --- | --- |
| Liquidity fragmentation | Assets on custom subnets may not inherit broad public-market liquidity. |
| Operational complexity | Running or governing a subnet is heavier than issuing a token on an existing public chain. |
| Security model variability | Each custom chain's validator and governance choices matter. Institutions must diligence them. |
| Distribution challenge | A permissioned institutional subnet can become a high-quality silo if interoperability is not carefully designed. |

### Best use cases

Avalanche is best for bank consortiums, private credit, structured products, tokenised funds with restricted counterparties, and workflows where compliance and data control are more important than open composability.

## Stellar

Stellar is the least "general smart-contract platform first" of the group, but that is part of its strength. It has long focused on payments, asset issuance, and issuer controls. Franklin Templeton's BENJI is the standout proof point: a U.S.-registered tokenised money-market fund with years of production history, plus expansion of the Benji platform into Luxembourg UCITS and Singapore retail tokenised fund use cases.

### Strengths

| Dimension | Assessment |
| --- | --- |
| Regulated asset proof | Very strong. BENJI gives Stellar one of the clearest real-world tokenised fund case studies. |
| Issuer controls | Strong. Stellar assets have built-in issuer/distribution account patterns and authorization controls. |
| Payments fit | Strong. Stellar is optimized for low-cost asset movement and payment corridors. |
| Simplicity | Strong. For straightforward asset issuance, Stellar can be easier to reason about than a fully general VM ecosystem. |
| Compliance posture | Strong for asset issuers who want allowlists, authorization, and controlled asset access. |

### Weaknesses

| Weakness | Implication |
| --- | --- |
| Smaller DeFi ecosystem | Less useful for assets that need broad composability or collateral use across many venues. |
| Lower developer mindshare than EVM/Solana | Fewer teams can immediately build complex tokenisation workflows. |
| Narrower institutional narrative | Strong in funds/payments, less broad in high-frequency market structure or app-specific chains. |

### Best use cases

Stellar is best for regulated payment assets, money-market funds, cross-border settlement assets, and issuer-controlled tokenised securities where simplicity and compliance controls matter more than open DeFi composability.

## Comparison Matrix

Scores are relative, from 1 (weak) to 5 (strong), and reflect institutional tokenisation rather than overall chain quality.

| Criteria | Ethereum | Solana | Avalanche | Stellar |
| --- | ---: | ---: | ---: | ---: |
| Institutional adoption proof | 5 | 3 | 4 | 5 |
| Liquidity and distribution | 5 | 4 | 3 | 3 |
| Cost and throughput | 2 | 5 | 4 | 4 |
| Compliance controls | 4 | 4 | 5 | 5 |
| Privacy/control options | 3 | 4 | 5 | 4 |
| Developer/vendor maturity | 5 | 4 | 4 | 3 |
| Public composability | 5 | 4 | 3 | 2 |
| Custom institutional environments | 3 | 3 | 5 | 3 |
| Simplicity for regulated issuance | 3 | 3 | 3 | 5 |

## Where Competitors Outperform Solana

Ethereum outperforms Solana in institutional trust and distribution. A compliance officer or asset-management CTO is more likely to have seen Ethereum token standards, EVM audits, custody support, and BUIDL-style case studies. The main blocker is not whether Solana can technically support tokenisation; it is whether a buyer can procure a complete, familiar operating model.

Avalanche outperforms Solana for permissioned institutional networks. If a bank wants a closed environment with known validators, KYC/KYB gates, and custom rules from day one, Evergreen is easier to explain than a public Solana deployment plus custom controls.

Stellar outperforms Solana in simple regulated asset issuance proof. Franklin Templeton's BENJI story is easy to understand: a regulated asset manager used Stellar for a live tokenised fund over multiple years. Solana needs more of these boring-but-important case studies.

## Where Solana Can Win

Solana can win where tokenised assets need to be active, not passive.

Examples:

1. Tokenised cash-like funds used as collateral in trading systems.
2. Tokenised equities or fund units with frequent transfers and market-maker activity.
3. High-volume stablecoin settlement tied to tokenised assets.
4. Consumer-facing tokenised products with many small holders.
5. Tokenised invoices, receivables, rewards, or loyalty balances where fee sensitivity is high.
6. Hybrid products where Web2 apps hide most wallet complexity but settle on public infrastructure.

This is an institutional niche that still looks under-owned: not "private chain for banks" and not "expensive settlement layer for large tickets," but public internet capital markets with compliance-aware controls.

## Recommendations for Solana

### 1. Productise a regulated-token reference stack

Solana should package a reference implementation for regulated tokenised funds and securities:

| Module | Needed capability |
| --- | --- |
| Identity registry | Whitelisted holders, jurisdiction data, accredited/qualified investor status. |
| Transfer hook | Pre-transfer compliance checks, lockups, concentration limits, sanctions screening callbacks. |
| Confidential transfer | Selective privacy for balances and flows. |
| Issuer controls | Pause, freeze, forced transfer, redemption, burn/reissue, lost-key handling. |
| Reporting | Holder reports, transfer logs, NAV integrations, proof-of-reserve/NAV attestations. |
| Custody integration | Clear patterns for Fireblocks, Coinbase, Anchorage, BitGo, and institutional wallet policies. |

### 2. Make compliance legible to non-crypto buyers

Solana's token extensions are powerful, but the institutional buyer needs diagrams, legal mappings, audit reports, and vendor checklists. The winning artifact is not only SDK documentation; it is a "fund-in-a-box" operating model.

### 3. Build public case studies with regulated issuers

Solana needs more plain-language examples like:

- A regulated money-market fund issued on Solana.
- A transfer-agent workflow with recovery and reporting.
- A tokenised equity or bond pilot with named market makers and custody.
- A stablecoin cash leg paired with tokenised fund units.

### 4. Embrace hybrid privacy

Institutions do not need total privacy from regulators or issuers. They need selective disclosure. Solana should position confidential transfers plus controlled reporting as a better default than either full public transparency or fully private ledgers.

### 5. Compete on operational cost, not only TPS

The strongest Solana argument is not just fast blocks. It is lower all-in operating cost for issuance, transfers, redemptions, corporate actions, market making, and reconciliation.

## Final View

No single L1 is best for every institutional tokenisation use case.

Ethereum is the safest default for liquid, broadly distributed institutional assets. Avalanche is the strongest option for permissioned institutional networks. Stellar is the cleanest proof point for simple regulated asset issuance and payments. Solana is the most compelling challenger for high-volume, low-cost, public-market tokenisation, especially when assets need to move often and interact with stablecoin liquidity.

For Solana, the opportunity is not to copy Ethereum's institutional path. It should own a sharper category: compliance-aware assets that can move at internet speed.

## Sources

- BlackRock and Securitize announced BUIDL on Ethereum: https://www.businesswire.com/news/home/20240320771318/en/BlackRock-Launches-Its-First-Tokenized-Fund-BUIDL-on-the-Ethereum-Network
- Ethereum for Institutions, RWAs and stablecoins overview: https://institutions.ethereum.org/rwa
- ERC-3643 / T-REX regulated token standard: https://eips.ethereum.org/EIPS/eip-3643 and https://www.erc3643.org/
- Solana tokenisation overview: https://solana.com/solutions/tokenization
- Solana Token Extensions documentation: https://dev-solana.com/docs/token-extensions
- Solana confidential balances documentation: https://www.solana-program.com/docs/confidential-balances
- Stellar and Franklin Templeton BENJI five-year announcement: https://stellar.org/press/franklin-templeton-stellar-development-foundation-mark-five-years-of-benji-the-first-u-s-registered-tokenized-money-market-fund
- Stellar asset controls and regulated asset design: https://developers.stellar.org/docs/tokens/control-asset-access
- Stellar asset token models and SEP-57/ERC-3643 discussion: https://developers.stellar.org/docs/tokens/anatomy-of-an-asset
- Avalanche Evergreen overview: https://kr.avax.network/evergreen
- Avalanche Evergreen launch coverage and institutional feature summary: https://cointelegraph.com/news/avalanche-introduces-evergreen-subnets-to-connect-institutions-on-blockchain
- J.P. Morgan, Apollo, and WisdomTree portfolio management/tokenisation paper: https://www.jpmorgan.com/onyx/documents/portfolio-management-powered-by-tokenization.pdf
