# TraceClimate design and verification record

## Concept
`concept.png`, generated using the built-in OpenAI image generation tool. Full prompt: a white, forest-green and teal environmental evidence workspace with a left navigation rail, unboxed metrics, temperature timeline, readings table and narrow evidence review panel; synthetic Bangkok sample; local Ethereum disclosure. Primary actions: Import CSV and Anchor evidence. The original full tool prompt is retained in the chat.

## Design system
White #ffffff background; dark #103333 headings; teal #009c91 observations; forest #07594d actions; gray #e2e8e9 dividers; amber #df7418 flags. Inter/Arial. Navigation, chart, table, and review panel share a restrained geometry. Code-native chart and controls; Lucide icons; no screenshot UI or decorative raster imagery.

## Intentional corrections to generated concept
- Chart and table use actual synthetic measurements and UTC labels, replacing the concept's internally inconsistent example values and dates.
- “Within threshold” replaces “Normal”: the method does not certify normality.
- “Local Ethereum demo” replaces the concept panel's incorrect “Ethereum test network” wording.
- Added sample download, verification, receipt export and flagged-only filter to complete the required workflow.
- Added persistent reset disclosure; the development chain is ephemeral.
- Leaf icon uses Lucide rather than a generated brand mark.
- Narrow screens stack the review panel below the chart/table; navigation becomes horizontal.

## Fidelity and functional checks
Verified in the Codex in-app browser, without a Playwright fallback. Screenshots were taken with the browser screenshot API and saved as PNG. The concept and final workspace capture were both inspected with `view_image` in the same QA pass.

| Comparison | Evidence and disposition |
| --- | --- |
| Palette | White canvas, forest text/actions, teal data and amber flags match the concept's palette. |
| Composition | Persistent left rail, open metrics, chart/table and single review panel retained. Source disclosure moved below header to avoid crowding. |
| Typography | Inter hierarchy and explicit button/table sizes retained; headline is slightly smaller to accommodate actual desktop view. |
| Copy | Primary heading, subtitle, navigation and CTA preserved. Above-fold differences are the documented truthfulness corrections, source placement, actual measurements and required workflow controls above. |
| Chart | Actual 48-point series replaces the decorative concept series. UTC labels are explicit. Mobile axis text enlarged after inspection. |
| Review panel | Reduced vertical padding after first capture so evidence actions remain visible on desktop. |
| Responsive layout | Checked at 390×844 viewport override (375 px content width due to scrollbar). No document horizontal overflow. Table scrolls in its own region and the review panel stacks below it. |

Desktop checked at 1440×960 and the concept's native 1536×1024 viewport override. The browser's scrollbar reduces the content/screenshot area for long pages. Filtered screenshot `03-flagged-readings.png` is 1536×1024 and has no vertical overflow. Temporary viewport override was reset afterward.

The implementation was visually verified against the concept with the listed intentional deviations. The source disclosure placement, data-driven chart shape, table row density and action panel contents differ deliberately; it is not a pixel-identical replica. No blocking legibility or page-overflow issue remained in inspected views.

Functional browser checks: initial 48 readings / 2 flags; flagged-only filter produces 2 rows; anchor produces receipt and disables duplicate action; ledger shows transaction/block/contract; original CSV verifies successfully; changed CSV fails verification; methodology and sample reload navigation work. Seven automated tests pass, including actual EVM authorization and duplicate rejection. Production build succeeds.

Dependency audit reports 36 vulnerabilities (5 critical, 24 high, 6 moderate, 1 low), including legacy development-chain dependencies. This is not security-cleared for public hosting. Node 25 falls back from the optional native uWS module to its JavaScript implementation; tested workflow still passes.
