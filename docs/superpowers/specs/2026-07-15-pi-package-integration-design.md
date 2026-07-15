# Design Spec: Pi Package Integration

## Overview
This specification details the integration of Pi Package support into ForgeSkills to make it installable globally via the Pi Agent's native package manager (`pi install`).

## Goals
- Add `"pi-package"` keyword to `package.json` for discoverability.
- Add `pi` manifest configuration to `package.json` pointing to `./skills`.
- Document Pi installation instructions in `README.md`.

## Changes

### package.json
- Update `keywords` array to include `"pi-package"`.
- Add a root-level property `"pi"` with `"skills"` pointing to `["./skills"]`.

### README.md
- Add a new sub-section under `Installation & Management` documenting how to use `pi install`.

## Verification
- Run `bun test` to ensure that adding package.json fields does not break any tests.
- Verify that `package.json` complies with valid JSON format.
