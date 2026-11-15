# Anime Waifus Gallery

An infinite-scroll anime illustration gallery built with TanStack Start, React 19, TanStack Query, and Tailwind CSS v4, powered by the [AnimeMoe API](https://api.animemoe.us).

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (SSR via Nitro)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) (`@tanstack/react-query` + `@tanstack/react-router-ssr-query`)
- **UI & Styling**: React 19, Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react`, `react-masonry-css`, `react-infinite-scroll-component`
- **Tooling**: Vite, TypeScript, Vitest, ESLint (`@tanstack/eslint-config`), Prettier

## Scripts

- `npm run dev` — Start the Vite development server on port 3000
- `npm run build` — Build client and SSR Nitro bundles
- `npm run preview` — Preview the production build locally
- `npm test` — Run unit tests with Vitest
- `npm run lint` — Run ESLint
- `npm run format` — Run Prettier
- `npm run check` — Format with Prettier and auto-fix ESLint issues

## Routes

- `/` — Responsive masonry gallery with infinite scroll and blur-up placeholders
- `/waifu/$imageId` — Artwork detail view with metadata, source link, and infinite-scroll similar illustrations
