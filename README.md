# React + Vite

This is a React + Vite profile dashboard that authenticates with Basic Auth, stores a JWT, and fetches user data from a GraphQL API.

## Requirements

- Node.js + npm

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_DOMAIN=https://learn.reboot01.com
VITE_SIGNIN_PATH=/api/auth/signin
VITE_GRAPHQL_PATH=/api/graphql-engine/v1/graphql
```

Notes:

- `VITE_API_DOMAIN` should be the domain only (no trailing endpoint).
- `VITE_SIGNIN_PATH` and `VITE_GRAPHQL_PATH` are appended to `VITE_API_DOMAIN`.
- Do not put secrets in `.env` (frontend env values are visible in the built app).

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This project deploys using `gh-pages`.

1. Ensure `vite.config.js` contains the correct base path:

   - If your repo is `https://github.com/<user>/<repo>`, set:

     ```js
     base: '/<repo>/',
     ```

2. Deploy:

```bash
npm run deploy
```

3. In GitHub:

- Repo **Settings** -> **Pages**
- Source: **Deploy from a branch**
- Branch: `gh-pages` and folder `/ (root)`

## Routing on GitHub Pages (SPA)

GitHub Pages returns 404 on direct refresh of routes like `/login` or `/profile`. This repo includes a `public/404.html` redirect + an `index.html` handler to support SPA routing.
