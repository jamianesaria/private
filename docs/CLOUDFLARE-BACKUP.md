# Cloudflare backup: current state

## November 7 refresh

Version `298aed97-7385-422b-acaf-353da7fe26c5` was activated after a fresh
snapshot and preview checks. The snapshot was generated at 2026-11-07
15:42:44 UTC. All 36 route and RSC checks passed on the active version, as did
desktop/blog navigation, mobile layout, admission form hydration, Studio shell,
cross-origin form rejection and 404 checks. A published Sanity article matched
the preview. These checks are not proof of complete site parity, successful
Studio login, live form submission, or automatic CMS updates.

The configuration routes `/_next/static/*` directly to static assets rather
than running the Worker first. Other requests still use the Worker; request
quotas and per-request CPU limits still apply. Studio and form behavior must be
retested on any eventual custom domain. Vercel and DNS were not changed.

The production Vercel site and GitHub main branch are unchanged. All Cloudflare-specific work is in this separate local worktree. GitHub automatic builds for the backup are currently disabled.

## Why the original backup failed

Cloudflare logs confirmed `Exceeded CPU Limit` for the Next.js rendering Worker. The free plan has a per-request CPU limit. Even a small number of visitors can trigger it because each request performs rendering and content processing. Adding a data cache alone did not make the full renderer reliable.

## Tested alternative: public snapshots plus a small form API

The test version serves complete public HTML and React navigation payloads generated from the isolated local Next.js build. It does not use Vercel as its origin. JavaScript, CSS, fonts, videos and pictures are hosted as Cloudflare assets. Public page requests do not run Next.js server rendering.

The small Worker retains the existing server-side form handler and validation, private Sanity dataset, privacy verification, same-origin checks, image validation and idempotent saves. Read/write tokens remain encrypted Worker secrets and are not included in public assets.

The captured Sanity Studio is a browser application and still connects to Sanity for authentication and editing. Browser navigation inside Studio uses its shared shell.

### Material differences

- Public content is a published snapshot. Editing Sanity does **not** automatically regenerate these files. A new snapshot build and deployment is required. Deletions and newly published blog URLs take effect after that build.
- Draft/visual preview and on-demand cache revalidation endpoints return an explicit 501 response in snapshot mode. Sanity Studio editing/publishing is separate and works, but real-time draft overlays are not reproduced.
- The user approved snapshot mode. The active backup is at `https://jamia-backup.jamianesaria.workers.dev`; the previously active snapshot version `b8b3e2fe-330c-4353-aea0-064362a99f7f` remains available for rollback.
- Automatic GitHub builds are not configured. They must stay disabled until the independent snapshot build process is connected and verified.
- No custom domain, DNS or nameserver changes have been applied. The main domain still uses Vercel DNS. No failover exists yet.

## Commands

`scripts/backup-refresh-plan.mjs` is an experimental, local-only dependency
planner. It currently selects the homepage and notice board for notices, the
appropriate routine page for routines, and both result pages for exam-result
changes. It falls back to every known route for all other or malformed change
types. It does not receive webhooks, render pages, update assets, or deploy.
Its dependency assumptions must be revalidated when site components change.
Run `node --test scripts/test-backup-refresh-plan.mjs` to check its behavior.

Run from the `.cloudflare-backup` worktree only:

`npm run cloudflare:refresh` runs the build, starts an isolated local renderer, creates and scans snapshots, uploads a non-active preview, and verifies public routes and a published Sanity article. It prints the version to review. It deliberately does not promote an unreviewed version. The existing live backup stays available if a build or check fails.

For code updates, the backup source must first be synchronized with the intended production commit. This command refreshes CMS content from the current backup source; it does not automatically merge or push GitHub branches.

Individual steps:

1. `npm run build`
2. `node node_modules/next/dist/bin/next start -p 3037 -H 127.0.0.1`
3. In another terminal: `node scripts/build-backup-snapshots.mjs`
4. `npx wrangler versions upload --config wrangler.static.jsonc --preview-alias static-test`
5. Test the new version, then promote only the exact tested version with `npx wrangler versions deploy <version-id>@100% --config wrangler.static.jsonc --yes`.

Public snapshot generation uses the server read token locally. It scans generated HTML, RSC payloads and JavaScript for known credentials before allowing upload. No `.env` file or `.wrangler` directory belongs in Git or the uploaded assets.

`/api/backup-status` in the snapshot preview reports the content generation time, source commit and number of routes. It does not expose credentials or submissions.

## Verification completed for the first snapshot preview

- 36 public route and redirect checks, with RSC response checks.
- 30 extra homepage requests; no HTTP failures in that run.
- Local and remote headless browser checks: desktop navigation, blog navigation, mobile width, admission form hydration, Studio login screen, no same-origin asset errors or JavaScript execution errors.
- Admission, contact and Badri APIs created records in the private Sanity dataset and deduplicated retries. Only the uniquely marked temporary test records were removed afterward.
- Cross-origin form requests were rejected and a missing page returned 404.

These tests do not establish a zero-downtime guarantee, global performance, successful real-user authentication, live draft preview, or CMS rebuild automation. Free account and Sanity quotas still apply.

## Activation verification

After user approval, the snapshot version was promoted to 100% of the backup Worker's traffic. Active-route verification passed for all 36 routes and 30 additional homepage requests. The sampled public requests used 0–1 ms CPU and had no Worker exceptions. In a separate mixed public/form sample, one first form request used 17 ms CPU, with subsequent form requests at 2–5 ms; all sampled requests completed successfully. This is not a guarantee that every future API request will remain under the free plan CPU allowance.

The active public-route timing run had 33 ms median, 58 ms p95 and 171 ms maximum from the testing location. These figures measure HTTP responses, not total visual loading on every user's device.

The existing Wrangler OAuth token receives 403 for the Workers Builds configuration API. Automatic builds remain disabled. Configuring an unattended pipeline requires the appropriate Cloudflare Builds access or a dashboard configuration, along with build-time Sanity secrets. Do not paste credentials into chat.
