# Joshua AI Robotics Website

One-page site for [joshua-ai-robotics.org](https://joshua-ai-robotics.org) with a framework introduction, AI demo and diagram, followed by GitHub links and a searchable hardware/device-software catalog for [Joshua](https://github.com/Joshua-AI-Robotics/Joshua).

Full documentation lives on GitHub: [Joshua guide and quick start](https://github.com/Joshua-AI-Robotics/Joshua/blob/develop/AGENTS.md#quick-start).

## Integration catalog

The catalog appears at the bottom of Project, below the AI demo, diagram and
GitHub links. A divider and “Joshua in Numbers” introduction explain the counts. `index.html#project`
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

