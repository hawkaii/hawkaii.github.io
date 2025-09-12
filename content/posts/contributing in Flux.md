---
title: "contributing in Flux"
date: "2025-09-13"
tags:
  - seed
---
#  Introducing `--show-history` for `flux debug helmrelease`

- What: A new `--show-history` flag for `flux debug helmrelease` that prints the Helm release history inline with your Flux debugging output.
- Why: Faster triage with fewer tool switches. See rollouts, rollbacks, and failure points at a glance.
- How: Upgrade your Flux CLI to a version that includes PR #5505 and run:
  ```
  flux debug helmrelease <name> -n <namespace> --show-history
  ```

---

## The problem this solves

When a HelmRelease is stuck in a failed or pending state, the answer is rarely in a single log line. You typically want to see:

- The sequence of revisions
- Which upgrades were superseded or rolled back
- When a failure first appeared
- Which chart/app versions were involved

Helm already exposes this via `helm history`, but in a GitOps workflow, it’s natural to start with `flux debug helmrelease`. Having history in the same context reduces friction and helps you build a timeline faster.

---

## Backwards compatible by design

- The flag is opt-in. Running `flux debug helmrelease` without it behaves as before.
- It only augments your output with history; no changes to reconcile or controller behavior.

Tip: If your CLI doesn’t recognize `--show-history`, upgrade to a Flux CLI version that includes [PR #5505](https://github.com/fluxcd/flux2/pull/5505):
```
flux --version
# then upgrade using your preferred method (brew, curl, package manager)
```

---

## Behind the scenes

This addition surfaces the Helm release history in a familiar, tabular format—mirroring what you’d expect from `helm history`—and integrates it into `flux debug helmrelease`, so your diagnostic context stays in one place.

---

## My contribution journey

- Problem framing: Debugging sessions often start with `flux debug` but history required switching tools.
- Scope selection: Add a single flag that prints the essentials without overwhelming the default debug output.
- Implementation principles:
  - Keep the flag optional and discoverable (`--help` shows it).
  - Present a concise, readable table users already understand.
  - Avoid changing controller logic—strictly a CLI UX improvement.
- Collaboration: Incorporated reviewer feedback to align with Flux CLI patterns and messaging consistency.
- Outcome: Merged in [fluxcd/flux2#5505](https://github.com/fluxcd/flux2/pull/5505).

Useful links:
- Flux repository: [fluxcd/flux2](https://github.com/fluxcd/flux2)
- Contribution guide: [CONTRIBUTING.md](https://github.com/fluxcd/flux2/blob/main/CONTRIBUTING.md)
- The PR for this feature: [#5505 – Add --show-history flag to debug helmrelease](https://github.com/fluxcd/flux2/pull/5505)

---

## Final thoughts

So i was really fascinated by GitOps toolkit and surfing through helm while learning more about Kubernetes for GKE hackathon. Flux really caught attention and was really grateful to have fixed a issue.