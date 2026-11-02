# Contributing

## Development setup

```bash
# install dependencies
npm i

# run tests
npm test

# run lint + tests (CI)
npm run test:prod

# build dist + typedoc
npm run build
```

## Project structure

- `src/` — barcode decoders and utilities, one module per symbology
- `test/` — Jest test suites
- `docs/plan/` — persistent execution plans (gem-team workflow)

## Making changes

1. Add or edit a decoder module under `src/` following the existing `decoder(lines)` signature.
2. Add tests under `test/` covering valid inputs, edge cases, and malformed input.
3. Run `npm run test:prod` to lint and test before opening a PR.

## Committing

This project uses [Commitizen](https://commitizen.github.io/cz-cli/) with conventional commits. Stage your changes and run:

```bash
npm run commit
```

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) format, e.g.:

```
feat: add Code 11 decoder
fix: correct EAN-13 first digit from L/G parity
```

## Publishing to npm

Publishing is automated via [semantic-release](https://semantic-release.gitbook.io/):

1. Merge a PR to `master` whose commits contain `feat:`/`fix:`/`chore:` conventional types.
2. `semantic-release` runs on `master`, determines the next semantic version, updates `CHANGELOG.md`, and creates a GitHub release.
3. The GitHub `release` event triggers `.github/workflows/npmpublish.yml`, which runs `npm publish` via npm trusted publishing (OIDC) — no long-lived `npm_token` secret is required.

No manual `npm version` / `npm publish` step is required — doing so manually can conflict with semantic-release's version management.

### Manual publish (emergency only)

If you must publish manually:

```bash
# 1. authenticate
npm login

# 2. build
npm run build

# 3. publish
npm publish
```

Do not bypass semantic-release unless necessary; it keeps the Git release, changelog, and npm version in sync.

## License

MIT