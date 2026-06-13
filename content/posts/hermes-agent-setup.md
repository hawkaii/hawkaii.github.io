---
title: "hermes-agent-setup"
date: "2026-06-13"
tags:
  - seed
draft: false
---


# hermes-agent-setup


I have made a hermes agent setup and have him automate of many of my task which will make me do things  and save time and more importantly will remove function 

on such example is  this cron job  i built 

in hermes's word 
Let me check the actual script and prompt behind it.Here's the full blog sync pipeline:

### Daily blog cron for my blog channel
**Cron job:** `daily-blog-sync` — runs at 6:00 AM IST daily (`30 0 * * *`), delivers to local only

For more context on the infrastructure this runs on, see [gcp-free-tier-hurdles](gcp-free-tier-hurdles).

**Flow:**

1. **`daily-blog-sync.sh`** (shell wrapper) orchestrates 3 steps:
   - Runs `sync-blog.py` (Python)
   - Runs `npx quartz build` in `~/hawkaii.github.io`
   - Logs everything to `vaults/second-brain/logs/blog-sync-YYYY-MM-DD.md`

2. **`sync-blog.py`** does the heavy lifting:
   - `git pull --ff-only` on the vault (gets latest from Obsidian Git sync)
   - Scans entire vault for `.md` files with `categories: ["Public Blog"]("public-blog")` in frontmatter
   - Skips drafts (`draft: true`), templates, logs, graphify dirs
   - Transforms frontmatter: vault format (`created`, `categories`, `status`) → Quartz format (`date`, `tags`, `draft`)
   - Copies matched posts to `~/hawkaii.github.io/content/posts/`
   - `git add -A` → commit → push the Quartz repo

3. **Quartz build** generates the static site from the synced content

4. **GitHub Pages** deploys from the push (via GH Actions on the Quartz repo)

**How you publish a post:** Write in Obsidian anywhere in the vault, add `categories: ["Public Blog"]("public-blog")` to frontmatter, set `draft: false`. The 6 AM cron picks it up automatically.

**Current status:** Last run was today at 6:09 AM IST — status `ok`.


I have set  up hermes in [GCP vm](gcp-free-tier-hurdles) which has it's struggle 