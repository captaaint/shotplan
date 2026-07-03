import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const dbPath = join(process.cwd(), 'db.json');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

type CollectionName = 'sessions' | 'clients' | 'leads' | 'locations' | 'packages';
type Entity = { id: string; [key: string]: unknown };
type Database = Record<CollectionName, Entity[]> & { $schema?: string };

const collectionNames: CollectionName[] = ['sessions', 'clients', 'leads', 'locations', 'packages'];

app.use(express.json());

app.use('/api', (_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  next();
});

app.options('/api/{*splat}', (_req, res) => {
  res.sendStatus(204);
});

for (const collectionName of collectionNames) {
  app.get(`/api/${collectionName}`, async (_req, res, next) => {
    try {
      const db = await readDatabase();
      res.json(db[collectionName]);
    } catch (error) {
      next(error);
    }
  });

  app.get(`/api/${collectionName}/:id`, async (req, res, next) => {
    try {
      const db = await readDatabase();
      const entity = db[collectionName].find((item) => item.id === req.params.id);

      if (!entity) {
        res.sendStatus(404);
        return;
      }

      res.json(entity);
    } catch (error) {
      next(error);
    }
  });

  app.post(`/api/${collectionName}`, async (req, res, next) => {
    try {
      const db = await readDatabase();
      const entity = { ...req.body, id: createId() };

      db[collectionName] = [...db[collectionName], entity];
      await writeDatabase(db);

      res.status(201).json(entity);
    } catch (error) {
      next(error);
    }
  });

  app.patch(`/api/${collectionName}/:id`, async (req, res, next) => {
    try {
      const db = await readDatabase();
      const entityIndex = db[collectionName].findIndex((item) => item.id === req.params.id);

      if (entityIndex === -1) {
        res.sendStatus(404);
        return;
      }

      const entity = { ...db[collectionName][entityIndex], ...req.body, id: req.params.id };

      db[collectionName] = db[collectionName].map((item) =>
        item.id === req.params.id ? entity : item,
      );
      await writeDatabase(db);

      res.json(entity);
    } catch (error) {
      next(error);
    }
  });

  app.delete(`/api/${collectionName}/:id`, async (req, res, next) => {
    try {
      const db = await readDatabase();
      const nextCollection = db[collectionName].filter((item) => item.id !== req.params.id);

      if (nextCollection.length === db[collectionName].length) {
        res.sendStatus(404);
        return;
      }

      db[collectionName] = nextCollection;
      await writeDatabase(db);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

async function readDatabase(): Promise<Database> {
  const rawDatabase = await readFile(dbPath, 'utf-8');

  return JSON.parse(rawDatabase) as Database;
}

async function writeDatabase(database: Database): Promise<void> {
  await writeFile(dbPath, `${JSON.stringify(database, null, 2)}\n`);
}

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
