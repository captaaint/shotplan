# ShotPlan

ShotPlan is an Angular learning project for building a small photography planning app. It is split into modules and phases in [LEARNING-PLAN.md](./LEARNING-PLAN.md), with each phase adding a real piece of application architecture.

The app currently includes dashboards and CRUD-style domain screens for sessions, clients, leads, locations, and packages. Data is served through Angular SSR API routes backed by `db.json`.

## Tech Stack

- Angular 21
- Angular Material
- Angular Signals
- Angular Router with lazy domain routes
- Reactive forms
- Angular SSR
- Netlify Angular Runtime
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

Start the local development server:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

Build the app:

```bash
npm run build
```

The Netlify publish directory is configured in `netlify.toml`:

```text
dist/shotplan/browser
```

API requests are routed under:

```text
/api
```

The Angular app uses `src/app/core/config/api.config.ts` to point relative API requests to `/api`.

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
npm test
```

Runs the test suite.

```bash
npm run watch
```

Builds continuously in development mode.

## Local Data

The backend handler reads and writes [db.json](./db.json). The API routes expose these collections:

- `/api/sessions`
- `/api/clients`
- `/api/leads`
- `/api/locations`
- `/api/packages`

Supported methods are `GET`, `POST`, `PATCH`, and `DELETE`.

## Learning Plan

The tutorial roadmap lives in [LEARNING-PLAN.md](./LEARNING-PLAN.md). It moves from modern Angular fundamentals through signals, components, routing, forms, Material UI, HTTP, and finally a real Node.js backend.
