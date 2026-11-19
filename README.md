# Joshua AI Robotics Website

One-page site for [joshua-ai-robotics.org](https://joshua-ai-robotics.org) with two tabs:

- **Project** — framework overview, hardware/device-software counts and a shared integration search, followed by technical features and links to [Joshua](https://github.com/Joshua-AI-Robotics/Joshua)
- **About Us** — founder, core team, and affiliations (edit [`js/site-content.js`](js/site-content.js); optional `linkedin` URLs for people; affiliation logos in `assets/images/affiliations/`)

Full documentation lives on GitHub: [Joshua README](https://github.com/Joshua-AI-Robotics/Joshua/blob/develop/README.md).

## Integration catalog

Technical Backbone and Key Features form a compact overview at the top of Project.
The catalog appears at the bottom, below the AI demo, diagram and GitHub links. `index.html#project`
opens the full overview; `index.html#integrations` jumps to its catalog section.

[AGENTS.md](AGENTS.md) owns the device-addition rule, hardware/software scope,
source mappings, generation, verification and automatic refresh workflow.
Joshua's single-file device catalog supplies hardware status; the website never
maintains a second set of test results or manually edited counts.

The Pages workflow rebuilds from Joshua `develop` on site pushes, manual dispatch
and a six-hour schedule once configured. See the activation requirements in
[AGENTS.md](AGENTS.md#generation-and-automatic-publication).

## Custom domain

The domain is configured via the `CNAME` file (`joshua-ai-robotics.org`).

