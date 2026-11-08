<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

<!-- BEGIN:sanity-agent-rules -->
## Sanity CMS & Frontend Synchronization Rule

- Whenever any AI agent modifies, adds, or restructures any text, section, card, list, table, or media element on the frontend, the agent MUST update the corresponding Sanity CMS schema, query, and data mapping accordingly.
- The embedded Sanity Studio at `/studio` must remain functional, accessible locally and in production.
- Any new document types or fields must be reflected in the Sanity Desk Structure (`src/sanity/structure.ts`) with clear Bengali and English labels.
- All Sanity queries must have graceful fallbacks (e.g. referencing default records from `src/data/siteData.ts`) so that if the network or CMS is loading, the public website renders smoothly without crashing.
- Private student examination results, marks, and admission applications must never be exposed via public unauthenticated GROQ queries or public client bundles. Form submissions must use secure server-side API handlers (`/api/*`) utilizing server-only write tokens.
<!-- END:sanity-agent-rules -->
