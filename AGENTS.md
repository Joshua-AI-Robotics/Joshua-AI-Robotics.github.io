# Joshua public website

Preserve the existing white layout, typography and About Us content.
Start Project with its introduction and AI demo. Keep the integration catalog
last within Project, after the diagram and GitHub links. Introduce its counts
with a divider, the visible “Integration coverage” heading and a short explanation
of what is counted. There is no separate Integrations tab. Show two large counts together, one search
field, and linked results with their type and status. Search covers hardware,
device software, discovered candidates and other catalog records. Counts remain
independent of the search query. Keep source links labeled with directories.

## Catalog ownership and device additions

Joshua's `docs/hardware_catalog/<id>.json` owns each device's identity,
implementation status and validation history. A device integration must add or
update that single file in the same Joshua change. Keep candidate, integrated,
unsupported and retired statuses accurate. Software implementation is separate
from physical evidence and attributed review. The website consumes those facts;
do not copy test outcomes, validator identities or operating procedures here.

The [generator](scripts/update_integrations.py) imports every committed device
file, including newly added IDs outside the initial vendor discovery list. A new
device needs no website entry or manual count edit. Existing `catalog_id` values
handle legacy aliases. Review identity collisions rather than guessing a match.

[integration-targets.json](data/integration-targets.json) owns the dated discovery
scope, manufacturer sources and device-software mappings. Preserve meaningful
model/interface variants while deduplicating marketing aliases, protocol-only
versions, bundles and passive accessories. Explicit `coverage_exclusions` keep
generic families searchable without counting them again alongside exact models.
New catalog devices normally join the denominator automatically. Explain any
coverage exclusion. The dated vendor list plus current catalog is a researched
scope, not a worldwide total.

Device software must directly capture sensor data, control devices, expose
hardware control interfaces, or implement device communication. Add or update its
curated `joshua_source` mapping when introducing a driver/SDK dependency. Do not
guess integrations from arbitrary dependency names. The generator verifies each
mapped source against the selected commit. Simulators, learning/AI frameworks,
planners and general data/debugging tools are outside this metric. Pybricks is a
bench-control tool; SOES is an opt-in firmware path.

## Generation and automatic publication

Generate a local snapshot from a committed Joshua checkout with the version 2
catalog:

```sh
python3 scripts/update_integrations.py --joshua-root ../Joshua --revision HEAD
python3 -m unittest discover -s scripts -p '*_test.py'
```

`js/integrations-data.js` is generated. Never hand-edit its entries, counts or
statuses. The frontend derives both counts and percentages from that snapshot.
Directory and record links stay pinned to its Joshua commit even though commit
hashes are not displayed in the UI. Catalog parsing here validates the consumed
metadata; Joshua's own catalog checks remain the validation authority.

[pages.yml](.github/workflows/pages.yml) checks out Joshua `develop`, regenerates
the catalog and publishes the static artifact on site pushes, manual dispatch,
and a six-hour schedule. PRs validate/package their committed Joshua snapshot
without deploying; published builds and scheduled refreshes use `develop`. Failed builds
leave the previous deployment intact. No cross-repository write token is needed.
The schedule refreshes catalog changes after they reach `develop`; it is not an
instant cross-repository notification and GitHub may delay scheduled runs.

The workflow must be published on the site's default branch and Pages must use
GitHub Actions as its publishing source. Joshua's version 2 catalog must first
be available on `develop` (PR #160). Until those steps are completed, the local
snapshot is a preview and automatic publication is not active. Follow the user's
publication instructions; local preview work does not change hosting settings.

## Verification

Check JavaScript syntax, generator tests, and workflow shell/YAML syntax. Exercise
cross-kind search, candidate and unsupported statuses, empty results, show-more,
count stability, direct tab links, keyboard navigation and narrow layouts. Verify
that a newly committed device appears through regeneration without editing the
website's target list. No check may open hardware or launch Joshua runtime.

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
