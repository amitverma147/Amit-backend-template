# Bloom Travels — Backend Template

An Express + Mongoose backend template for quick project bootstrapping.

## Features

- Express 5
- Mongoose + MongoDB
- JWT auth scaffolding
- Environment config via `.env`

---

## Install

After this package is published, install with:

```bash
# npm
npm install bloom-travels-backend
# pnpm
pnpm add bloom-travels-backend
```

Or use the repository directly:

```bash
git clone https://github.com/TruwixTech/Bloom-Travels_Back-end.git
cd Bloom-Travels_Back-end
pnpm install
pnpm dev
```

## Usage

- Copy `.env.example` (if present) to `.env` and set `MONGO_URI`, `JWT_SECRET`, etc.
- Start dev server: `pnpm dev` (uses `nodemon`)
- Start prod: `pnpm start`

## Publishing (maintainers)

1. Make sure you're logged in to npm: `npm login`
2. Bump the version (conventional):

```bash
pnpm version patch  # or minor/major
```

3. Run tests (prepublishOnly will run tests automatically):

```bash
pnpm test
```

4. Publish:

```bash
pnpm publish --access public
```

> Note: `prepublishOnly` runs `pnpm test` — the template ships with a placeholder test script which currently passes.

## Contributing

Feel free to open issues or PRs in the repository.
