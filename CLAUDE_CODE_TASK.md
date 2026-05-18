# Task for Claude Code

You are setting up a fresh GitHub repo and deploying to Vercel for **Myatlastic** — an interactive geography app.

## Context

- **Brand**: Myatlastic
- **Domain**: `myatlastic.com` (already owned, currently parked at GoDaddy, DNS not yet updated)
- **GitHub**: target repo is `digitalcrest01/atlas` (user will delete and recreate before you run)
- **Hosting**: Vercel (already has a project named `atlas-nine-bay.vercel.app` — needs the right content pushed)
- **The whole repo is in this folder**. Do NOT modify the code, content, or `vercel.json`. They are intentional and tested.
- **CRITICAL — Vercel build config**: This is a static site with **NO build step**. The `vercel.json` explicitly disables `buildCommand` and `installCommand`. The `.vercelignore` excludes `mobile_setup/` so Vercel doesn't see its package.json and incorrectly auto-detect Node.js. **Do not undo any of this.**
- **NOTE**: Earlier deployments failed because (1) `cleanUrls: true` conflicted with rewrites and (2) Vercel auto-detected `mobile_setup/package.json` and ran `npm install` + `npm run build`, then looked for `/public/` output that doesn't exist. Both are now fixed in `vercel.json` and `.vercelignore`. Don't revert them.

## Pre-flight checks (run these first)

```bash
# 1. Verify you're in the right place
pwd
ls vercel.json README.md web/index.html

# 2. Verify vercel.json is valid JSON
cat vercel.json | python3 -m json.tool > /dev/null && echo "vercel.json: valid"

# 3. Verify the app HTML has the right brand
grep -c "Myatlastic" web/index.html
# Should output a number > 0 (currently 6)
grep -c "Roamly\|Mundio\|Atlasic" web/index.html
# Should output 0 (we've fully renamed)

# 4. Count files (sanity check)
find . -type f -not -path '*/\.git/*' | wc -l
# Should be 19
```

If any of these fail, **STOP** and ask the user before proceeding. The repo is already in a known-good state.

## Step 1 — Initialise git and push to GitHub

The user will have deleted and recreated the `digitalcrest01/atlas` repo before you run.

```bash
# Initialise (fresh repo, no history)
git init
git checkout -b main

# Set remote — the user must have a working GitHub auth method
# (gh CLI, SSH key, or a Personal Access Token in their git credential helper)
git remote add origin https://github.com/digitalcrest01/atlas.git

# Stage everything except what's in .gitignore
git add -A

# Verify what's about to be committed
git status

# Commit
git commit -m "Myatlastic v1: full app with compass star logo, voice, 197 countries"

# Push
git push -u origin main
```

If `git push` fails with auth errors, ask the user how they prefer to authenticate (`gh auth login`, SSH key setup, or PAT in credential helper).

## Step 2 — Verify the push

```bash
# Open the GitHub repo in browser to confirm
echo "Repo URL: https://github.com/digitalcrest01/atlas"
echo "Check that the file tree shows: vercel.json, README.md, web/, site/, assets/, mobile_setup/, docs/"
```

If `vercel.json` is missing from the GitHub file tree, the push didn't include it — re-stage with `git add vercel.json` and re-commit.

## Step 3 — Trigger Vercel re-deploy

Vercel auto-deploys on push to main. The user's existing project `atlas-nine-bay.vercel.app` should rebuild within ~30 seconds.

If Vercel is not auto-deploying:
- Check Vercel dashboard → project → Git → ensure `digitalcrest01/atlas` (main branch) is connected
- If the project was previously connected to a deleted version of the repo, the user may need to disconnect and reconnect the GitHub integration

```bash
# Wait ~60 seconds for Vercel to build, then check the deployment
echo "Watch deployment at: https://vercel.com/dashboard"
echo "When status shows 'Ready', test:"
echo "  https://atlas-nine-bay.vercel.app/        → marketing site"
echo "  https://atlas-nine-bay.vercel.app/app     → geography app"
echo "  https://atlas-nine-bay.vercel.app/privacy → privacy policy"
echo "  https://atlas-nine-bay.vercel.app/terms   → terms of service"
```

## Step 4 — Verify deploy with curl

```bash
# Wait until Vercel reports "Ready", then run these checks:

# Marketing site should serve at /
curl -sI https://atlas-nine-bay.vercel.app/ | head -1
# Expected: HTTP/2 200

# App should serve at /app  
curl -sI https://atlas-nine-bay.vercel.app/app | head -1
# Expected: HTTP/2 200

# Check the content has the right brand
curl -s https://atlas-nine-bay.vercel.app/ | grep -c "Myatlastic"
# Should be > 0

# Check the app loads the country data
curl -s https://atlas-nine-bay.vercel.app/app | grep -c "Afghanistan"
# Should be > 0
```

If any return 404 or 500: stop and report what each curl shows.

## Step 5 — Report back to user

Once all 4 curl checks pass:

```
✓ Repo pushed to https://github.com/digitalcrest01/atlas
✓ Vercel deployment Ready at https://atlas-nine-bay.vercel.app/
✓ All routes responding 200:
    /         marketing site (Myatlastic landing)
    /app      geography app  
    /privacy  privacy policy
    /terms    terms of service

Next manual steps for the user (cannot be automated):
  1. Update DNS at GoDaddy:
     - A record   @    →  76.76.21.21 (or whatever Vercel's current apex IP is — check Vercel dashboard)
     - CNAME      www  →  13d42a5bc2140945.vercel-dns-016.com (from Vercel screenshot)
     - DELETE the existing "WebsiteBuilder Site" A record (GoDaddy parking)
     - DELETE the _domainconnect CNAME (GoDaddy parking helper)
  2. Wait 5-60 minutes for DNS propagation
  3. Verify at https://dnschecker.org/#A/myatlastic.com
  4. Set up email forwarding for support@myatlastic.com via Cloudflare Email Routing (free)
```

## Things you (Claude Code) should NOT do

- Do not modify `vercel.json` — it's tested and the routing is intentional
- Do not modify `web/index.html` or `web/countries_data.js` — these are the working app, ~244 KB inlined
- Do not generate icons or rebuild the logo — `assets/icon.svg` and `assets/favicon.svg` are already the correct compass-star design
- Do not auto-buy domains, set up Cloudflare, or modify GoDaddy DNS — those need user actions

## If something is unclear

The repo contains:
- `README.md` — high-level overview
- `LAUNCH_PLAN.md` — 14-day day-by-day plan
- `WHAT_TO_DO_NEXT.md` — concise next-steps guide
- `docs/BUSINESS_PLAN.md` — business and monetisation rationale
- `mobile_setup/README.md` — iOS/Android build instructions

Reference these rather than asking the user to re-explain context.
