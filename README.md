<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
  <img src="assets/logo.svg" alt="Orbit logo: an operator at the centre of three peers" width="96">
</picture>

# Orbit

Personal Claude Code plugin: seven role agents (`explorer`, `designer`, `architect`, `security`, `coder`, `reviewer`, `re-reviewer`), the `/decide` PM command, and two skills for multi-session work (`operator`, `peer`). Everything project-specific lives in a per-project profile.

## Install
```
/plugin marketplace add ~/orbit
/plugin install orbit@scrollout
```
Agents appear as `orbit:<name>`, the command as `/orbit:decide`. After editing the plugin, update it and restart sessions (a running session keeps the definitions it started with).

## Adopt in a project
1. `mkdir -p .agents && cp ~/orbit/templates/project.md .agents/project.md` and fill it in (TODO for unknowns). See `templates/project.example.md` for a filled one.
2. Optionally `cp templates/principles.md .agents/principles.md` and `templates/AGENTS.md ./AGENTS.md`.
3. Point `CLAUDE.md` or `AGENTS.md` at it: `@.agents/project.md` and `@.agents/principles.md` (Claude Code imports with `@` lines). If the profile lives elsewhere, state its path there; agents read `.agents/project.md` or that path first.

## Contents
- `agents/`, `commands/decide.md`: the team and its process; models: architect and security on fable, reviewer and re-reviewer on opus, the rest on sonnet.
- `skills/operator`, `skills/peer`: coordinating peer sessions (push queue, merge protocol, compaction).
- `templates/`: `project.md`, `project.example.md`, `handoff.md`, `principles.md`, `AGENTS.md`.

## OKF docs
Optional docs automation for projects that keep docs as an [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) (OKF) v0.2 bundle (default `docs/okf`).
- `/orbit:okf-init` scaffolds the bundle (index, log, constitution, doc rules, AGENTS.md/CLAUDE.md pointers, `.agents/okf.json`) and never overwrites.
- `node ~/orbit/scripts/validate-okf.mjs --root .` lints it (zero dependencies; settings from flags or `.agents/okf.json`; defaults: bundle `docs/okf`, 4000 chars per doc, AGENTS.md at most 80 lines, pointer files CLAUDE.md, GEMINI.md, .github/copilot-instructions.md, .cursor/rules/agents.mdc). Skill `okf` has the rules.
- `hooks/hooks.json` runs the validator after Write/Edit under the bundle (silent without node or a bundle). `templates/githooks/pre-commit` is a commit-time snippet.

## Agents sync
Instead of vendoring agent copies into `.claude/` (and keeping them in sync), install this plugin: the agents, command and skills load in every project. A project may still vendor its own copies in `.claude/agents`.

## License
[MIT](LICENSE)
