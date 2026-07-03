# ShotPlan

ShotPlan is an Angular learning project for building a small photography planning app. It is split into modules and phases in [LEARNING-PLAN.md](./LEARNING-PLAN.md), with each phase adding a real piece of application architecture.

The app currently includes dashboards and CRUD-style domain screens for sessions, clients, leads, locations, and packages. Data is served by a local Express API backed by `db.json`.

## Tech Stack

- Angular 21
- Angular Material
- Angular Signals
- Angular Router with lazy domain routes
- Reactive forms
- Angular SSR
- Express
- Vitest
- Prettier

## Project Structure

```text
src/app/
  core/        app-wide config, layout, guards, services, HTTP interceptors
  domains/    feature domains such as sessions, clients, leads, locations, packages
  shared/     reusable UI and form components
```

Each domain keeps its own routes, data-access services/stores, feature pages, and local components.

## Getting Started

Install dependencies:

```bash
npm install
```

Build the app:

```bash
npm run build
```

Start the local API and SSR server:

```bash
npm run api
```

The built app and API run at:

```text
http://localhost:4000
http://localhost:4000/api
```

For day-to-day Angular development, run the API server in one terminal and the Angular dev server in another:

```bash
npm run api
npm start
```

Then open:

```text
http://localhost:4200
```

The Angular app uses `src/app/core/config/api.config.ts` to point relative API requests to `http://localhost:4000/api`.

## Available Scripts

```bash
npm start
```

Runs the Angular development server.

```bash
npm run build
```

Builds the browser and server bundles into `dist/shotplan`.

```bash
npm run api
```

Runs the compiled Express/SSR server from `dist/shotplan/server/server.mjs`.

```bash
npm test
```

Runs the test suite.

```bash
npm run watch
```

Builds continuously in development mode.

## Local Data

The local backend reads and writes [db.json](./db.json). The Express routes expose these collections:

- `/api/sessions`
- `/api/clients`
- `/api/leads`
- `/api/locations`
- `/api/packages`

Supported methods are `GET`, `POST`, `PATCH`, and `DELETE`.

## Learning Plan

The tutorial roadmap lives in [LEARNING-PLAN.md](./LEARNING-PLAN.md). It moves from modern Angular fundamentals through signals, components, routing, forms, Material UI, HTTP, and finally a real Node.js backend.
