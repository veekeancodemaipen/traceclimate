# Devpost submission draft

## Project name
TraceClimate

## Elevator pitch
Turn environmental sensor readings into reviewable, tamper-evident records with explainable anomaly screening and blockchain-backed integrity checks.

## About the project

### Inspiration
Climate decisions depend on environmental observations that people can inspect and trust. A spreadsheet can be copied or changed without carrying an obvious record of its history. We set out to make a small but useful part of that problem visible: which readings deserve review, and does the dataset we are looking at still match the evidence that was recorded?

### What it does
TraceClimate is an environmental-data review workspace. Upload a temperature CSV, inspect a timeline, and filter unusual readings. The app explains its statistical screening method and preserves every observation—including flagged values. One action anchors fingerprints of the normalized dataset and its screening report in a Solidity registry. A later upload checks those fingerprints against the ledger, revealing changed or unrecorded data.

The project aligns with **Climate Data & Environmental Monitoring**. Its intended users are community sensor teams, researchers, and environmental organizations preparing datasets for review and sharing.

### How we built it
The interface uses React and Vite, with an Express API for input validation and screening. A median absolute deviation baseline produces reproducible anomaly scores without external credentials. SHA-256 hashes cover normalized timestamp/temperature records and the analysis report. ethers sends transactions to a Solidity contract running on a local Ganache Ethereum chain. The contract restricts writes to a reviewer account and rejects duplicate dataset fingerprints.

The prototype runs locally with no paid service or wallet setup. Demonstration data is synthetic: 48 temperature observations with two injected spikes. It is not a deployed sensor network, a trained AI model, or a carbon-credit certification system.

### Challenges
The central design challenge was separating integrity from accuracy. Putting a hash on a blockchain does not make a sensor reading true. We made the screening method explicit, kept flagged readings in the evidence, and described precisely what the fingerprint covers. Canonicalizing timezones, numeric values, and row order also matters: harmless file formatting changes should not look like altered measurements.

### What we learned
For this workflow, reproducibility is more useful than an unexplained confidence score. A deterministic statistical baseline is easy to inspect and test, but needs human judgment when real weather extremes occur. Blockchain anchoring adds a record of a fingerprint; trustworthy environmental evidence still needs sensor provenance, reliable governance, and field validation.

### Accomplishments
The prototype brings ingestion, screening, anchoring, receipt export, and verification into one working workflow. It includes tests for altered readings, equivalent formatting, malformed input, duplicate anchoring, and unauthorized contract callers. The demo makes both a successful match and a tampering mismatch observable.

### What's next
Replace the ephemeral development chain with durable public-chain anchoring, add signed sensor identities and independent verification, and validate screening on real single-sensor datasets. Future anomaly models should be evaluated against labeled observations before making performance claims. Environmental impact remains a hypothesis to test through adoption; no emissions savings are claimed for this prototype.

### Credits and transparency
OpenAI Codex assisted with implementation, documentation, testing, and interface concepting. The app uses open-source libraries and synthetic demonstration data. The local blockchain resets when the server restarts; it is not a public testnet. Review the story to ensure it accurately reflects your own participation and learning before submission.

## Built with
React, JavaScript, Vite, Node.js, Express, Solidity, Ethereum, Ganache, ethers.js, SHA-256, CSV, CSS, Lucide

## Try it out links
Public repository URL: https://github.com/veekeancodemaipen/traceclimate
Local prototype: http://127.0.0.1:4173 (local only; not a public Devpost demo link).

## Video demo link
`TraceClimate-demo.mp4` is a 4 minute 31 second narrated walkthrough of captured working-app states, with synthesized narration. Hosted unlisted demo: https://youtu.be/kHMqFACu24c (YouTube displays a rounded duration of 4:32).

## Upload a File
Use `TraceClimate-submission.zip` after the final packaging step. It contains source, documentation, example data, and screenshots, excluding installed dependencies.
