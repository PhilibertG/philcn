# How a version reaches people

Nothing is published by accident. A version only leaves this repository when
a human merges one particular pull request. This page says what happens
around that click, and what to do when something goes wrong.

## The short version

1. Pull requests land on `main`. Their commit messages carry the type —
   `feat:`, `fix:`, `chore:` — and that type is what decides the next
   version number.
2. A robot called **release-please** keeps one permanent pull request open,
   titled `chore: release x.y.z`. It holds the next version number and the
   changelog it would publish. It rewrites itself every time `main` moves.
3. **You merge that pull request when you are ready.** That is the only
   moment anything is published.
4. Merging tags the version, publishes the GitHub release notes, and calls
   the delivery, which publishes the package to npm.

Between step 3 and step 4 there is no approval to give and no button to
press: merging is the decision.

## What the commit type does to the version

| Commit type | Effect on `x.y.z` | Appears in the changelog |
| --- | --- | --- |
| `fix:` | `z` goes up | Under "Bug fixes" |
| `feat:` | `y` goes up, `z` returns to 0 | Under "Features" |
| `feat!:` or a `BREAKING CHANGE:` line | `x` goes up | At the top, marked breaking |
| `chore:`, `ci:`, `docs:`, `refactor:`, `style:`, `test:`, `build:` | Nothing | Not shown |

A commit with the wrong type costs a line in the changelog, which is why
every pull request is checked by `scripts/check-commits.mjs` before it can
be merged. To read the commits of a branch the way the robot will:

```bash
node scripts/check-commits.mjs origin/main..HEAD
```

## Before you merge the release pull request

The checks have already run — types, tests, the site, the security scans.
What they cannot tell you is whether the library still feels right. So:

1. Run the showcase site and use the components by hand:

   ```bash
   cd site && npm run dev
   ```

   Open a dialog, a menu, the command palette, a calendar. Each should open
   with its animation, and work from the keyboard alone.
2. Read the changelog in the release pull request. Every line in it is a
   promise to whoever installs the package.

Merge only after that. There is no way to unpublish a version from npm
once it is out.

## What runs once you merge

One workflow run, two jobs:

- **Keep the release pull request up to date** — tags the version, writes
  the GitHub release, and hands the tag to the next job.
- **Deliver `vx.y.z`** — checks out the tag, installs, runs types, build
  and tests again against the tag itself, then publishes.

The second job re-runs the checks on purpose: the tag is what reaches
people, so the tag is what gets checked, even though the same checks passed
on the pull request.

## How the package is published without a token

There is no npm token anywhere in this repository, and there should never
be one. Publishing uses **Trusted Publishing**: npm is configured to trust
this repository and this workflow, the runner proves its own identity, and
npm accepts the upload on that basis. The upload also carries a signed
provenance statement — a receipt saying which commit and which workflow
built the file.

A token could be stolen. An identity that only exists for the length of a
job cannot.

## Where a release can go, and how to change it

The repository variable `DEPLOY_TARGET` decides:

| Value | What happens |
| --- | --- |
| `npm` | Publishes the package to npm. This is the current setting. |
| `ssh` | Copies the release to a server over SSH. |
| unset | Tags the version, publishes the notes, delivers nothing. |

```bash
gh variable set DEPLOY_TARGET --body npm
```

The SSH target needs four more settings, and refuses to run unless all four
are there: the secrets `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, and
the variable `DEPLOY_COMMAND`, which is the command run on the far side
with `TAG` set to the released tag.

```bash
gh secret set DEPLOY_HOST
gh variable set DEPLOY_COMMAND --body "/srv/philcn/deploy.sh"
```

## When the delivery fails

The version is tagged and the release notes are out, but nothing reached
npm. Nothing is broken and nothing half-published: npm either accepted the
file or it did not.

1. Read the failing job in the Actions tab. The error usually names the
   cause on its own line.
2. Fix whatever it named.
3. Replay the delivery for that tag, without making a new version:

   ```bash
   gh workflow run deploy.yml -f tag=v0.4.2
   ```

To check what is actually published:

```bash
npm view philcn version
```

npm takes a minute or two to show a new version after it accepts it, so a
stale answer right after a release means "wait", not "failed".

## The rules that hold this together

- `main` is protected: everything arrives through a pull request.
- The release pull request is merged by a human, never by a robot.
- No secret is ever written into the repository or its history.
- The checks run again on the tag before anything is published.
