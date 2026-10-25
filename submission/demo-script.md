# TraceClimate demo — approximately 3 minutes 40 seconds

Record the app at 1440×960 or similar. Keep the localhost address visible where helpful. Use your own narration; the script deliberately distinguishes a local chain from a public deployment.

## 0:00–0:30 · Problem and audience
Show the workspace.

“Environmental evidence often starts in a CSV. Before a community sensor team or researcher shares it, two questions matter: which readings deserve review, and has the dataset changed? TraceClimate connects explainable screening with a verifiable record. Our track is Climate Data and Environmental Monitoring.”

## 0:30–1:10 · Inspect the data
Point to the sample-data disclosure and chart. Select “Show flagged readings only.”

“This is synthetic demonstration data, not a field deployment. It contains 48 temperature observations and two injected spikes. The screen flags both for review using a median absolute deviation score. The method is deterministic statistics, not a trained AI model. A flagged reading could be a sensor problem or a real extreme, so we keep it in the evidence.”

## 1:10–1:55 · Anchor it
Clear the filter. Click “Anchor evidence,” then open “Evidence ledger.” Download the receipt.

“Anchoring normalizes timestamps and numbers, sorts the readings, and computes SHA-256 fingerprints for the dataset and its screening report. A Solidity contract records them on a local Ethereum development chain. This is a real EVM transaction, but it is not a public testnet. The receipt contains the transaction, block, contract address, and fingerprints. The registry rejects duplicate datasets.”

## 1:55–2:40 · Demonstrate tamper detection
Click “Verify CSV” and choose `public/bangkok-synthetic.csv`. Show the match. Verify `public/bangkok-changed.csv`. Show the mismatch.

“The original matches the anchored evidence. This copy changes one temperature, and no longer matches. Reordering rows or changing whitespace does not change the normalized record. Site names and extra columns are not covered by this version of the fingerprint.”

## 2:40–3:15 · Explain the boundaries
Open Methodology.

“Integrity is not accuracy. A blockchain cannot prove that a sensor was calibrated or that a measurement is true. This demo has one reviewer account and resets on restart. It supports transparent inspection, not carbon certification or a claim of emissions savings.”

## 3:15–3:40 · Close
Return to workspace or show README/tests.

“The next steps are signed sensor identities, durable anchoring, independent verification, and testing with real field data. TraceClimate demonstrates a small, reproducible path from raw observations to reviewable evidence. Source and instructions are included so judges can run the complete workflow locally.”

Before upload: inspect the recording for private tabs, account information or notifications. Upload a 3–5 minute video to an accepted host and paste its accessible URL into Devpost. Do not use a local file path as the video link.
