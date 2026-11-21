# Joshua AI Robotics Website

One-page site for [joshua-ai-robotics.org](https://joshua-ai-robotics.org) with two tabs:

- **Project** — framework introduction, AI demo and diagram, followed by GitHub links and a searchable hardware/device-software catalog for [Joshua](https://github.com/Joshua-AI-Robotics/Joshua)
- **About Us** — founder, core team, and affiliations (edit [`js/site-content.js`](js/site-content.js); optional `linkedin` URLs for people; affiliation logos in `assets/images/affiliations/`)

Full documentation lives on GitHub: [Joshua guide and quick start](https://github.com/Joshua-AI-Robotics/Joshua/blob/develop/AGENTS.md#quick-start).

## Integration catalog

The catalog appears at the bottom of Project, below the AI demo, diagram and
GitHub links. A divider and “Joshua in Numbers” introduction explain the counts. `index.html#project`
opens the full overview; `index.html#integrations` jumps to its catalog section.

[AGENTS.md](AGENTS.md) owns the device-addition rule, hardware/software scope,
source ownership, verification and daily publication workflow.
Joshua owns every hardware/software record, source mapping, schema, counting rule
and exporter. The website packages its generated JSON without a manual catalog.

The Pages workflow rebuilds from Joshua `develop` on site pushes, manual dispatch
and a daily schedule at 08:17 UTC. Open pages refresh catalog data every 24 hours. See the activation requirements in
[AGENTS.md](AGENTS.md#generation-and-daily-publication).

## Custom domain

The domain is configured via the `CNAME` file (`joshua-ai-robotics.org`).

