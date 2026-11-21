# Joshua public website

Preserve the existing white layout, typography and About Us content.
Start Project with its introduction and AI demo. Keep the integration catalog
last within Project, after the diagram and GitHub links. Introduce its counts
with a divider, the visible “Joshua in Numbers” heading and a short explanation
of what is counted. There is no separate Integrations tab. Show two large counts together, one search
field, and linked results with their type and status. Search covers hardware,
device software, discovered candidates and other catalog records. Counts remain
independent of the search query. Keep source links labeled with directories.

## Catalog ownership and device additions

Joshua owns all catalog data and logic. Hardware candidates, integrated devices,
manufacturer references, coverage exclusions and physical validation history live
in `docs/hardware_catalog/<id>.json`. Drivers, SDKs and device libraries live in
`docs/device_software_catalog/<id>.json`. Each device or software integration has
one authoritative record. Update that record in the same Joshua PR as its
implementation or status change. Joshua's catalog `AGENTS.md` files own eligibility
and counting rules; the website renders their export without redefining them.

Do not add a manual target list, software mapping, evidence copy or percentage
here. The former `data/integration-targets.json`, `js/integrations-data.js` and
local generator were migrated to Joshua. No catalog database is used.

## Generation and daily publication

The shared `tools/hardware_catalog.py` in Joshua validates and exports both
catalogs. It requires a clean committed checkout, preserves unknown historical
provenance, rejects invalid/missing integration references and pins source links
to the exported Joshua commit. It does not initialize drivers or access hardware.

[pages.yml](.github/workflows/pages.yml) checks out Joshua `develop`, installs
`jsonschema==4.26.0`, and runs its owning exporter into `_site/data/catalog.json`.
The JSON exists only in the deployment artifact; never commit a generated copy.
There are no website-side catalog schema, mapping or export implementations.

The site publishes once daily at 08:17 UTC, on website changes and on manual
workflow dispatch. Browser pages fetch the published JSON on load and refresh it
once every 24 hours. There is no minute polling or cross-repository write token.
Preserve the user's query, visible-result limit and working data during refresh.
A failed refresh keeps the loaded catalog; an initial failure shows explicit
unavailability. Failed builds leave the previous deployment intact.

The source migration is a draft stacked on Joshua PR #160. Keep this companion
website change in draft until that migration reaches `develop`. PR builds can
fall back to `JOSHUA_PREVIEW_REVISION` only while the software catalog is absent
from `develop`; production builds never publish an unmerged preview revision.
Once migrated, PR and production builds both consume the latest `develop`.
The Pages workflow must remain on the site's default branch with Actions as its
publishing source. Update the preview pin deliberately if its dependency changes.

For local verification, export from a clean committed Joshua checkout using its
supported Docker environment, placing JSON outside that checkout, then package
it at `_site/data/catalog.json` alongside the static website files. The export
needs neither website source data nor a second record update.

## Verification

Check JavaScript and workflow syntax. Verify the package contains the generated
catalog, source links match its Joshua commit, and no manual catalog remains.
Exercise initial load/failure, hardware and software counts, cross-kind search,
candidate/unsupported status, empty results, show-more and a daily refresh that
preserves the active query. A failed or malformed refresh must preserve working
counts and results. Keep keyboard navigation and narrow layouts intact.

Joshua owns exporter regression tests. Check equivalence with the prior catalog
and demonstrate that adding or integrating one Joshua record changes the export
without any website record edit. No check may open hardware or launch Joshua.

## Portrait and prompt illustration

Hye-Sung Moon's portrait is the local, unmodified snapshot at
[people/hye-sung-moon-linkedin.jpg](assets/images/people/hye-sung-moon-linkedin.jpg),
retrieved on 2026-11-18 from the public
[LinkedIn profile](https://www.linkedin.com/in/hyesungmoon). This is an explicit
portrait override; other people continue using their configured GitHub avatars.
Refresh this asset deliberately when requested rather than hotlinking an expiring
LinkedIn CDN URL.

The prompt GIF illustrates an AI assistant using Joshua MCP. Show discovery,
configuration preparation and validation. Current MCP adapters are read-only;
do not depict direct motor commands, automatic flashing or physical qualification.
Use a recognizable AI-assistant window with an assistant message, prompt composer
and Joshua MCP tool label. Keep the page white. The animation plays once in under
five seconds and settles on the completed prompt; there is no pause/play text
button. Provide a static reduced-motion fallback. GIFs are illustrative images,
not a working chat input.

Regenerate the desktop/mobile GIF and PNG variants with
`python3 scripts/generate_prompt_demo.py`. Authoring requires Pillow and DejaVu
Sans (or `--font /path/to/font.ttf`); site builds use the committed images and
need neither dependency. Update the image alt text when changing the prompt.
