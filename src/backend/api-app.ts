import express from 'express';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import databaseSeed from '../../db.json';

type CollectionName = 'sessions' | 'clients' | 'leads' | 'locations' | 'packages';
type Entity = { id: string; [key: string]: unknown };
type Database = Record<CollectionName, Entity[]> & { $schema?: string };

const collectionNames: CollectionName[] = ['sessions', 'clients', 'leads', 'locations', 'packages'];
const dbPath = join(process.cwd(), 'db.json');
const isNetlifyRuntime = process.env['NETLIFY'] === 'true';
let netlifyDatabase: Database | undefined;

export const apiApp = express();

apiApp.use(express.json());

apiApp.use((req, _res, next) => {
  for (const prefix of ['/api', '/.netlify/functions/api']) {
    if (req.url === prefix || req.url.startsWith(`${prefix}/`)) {
      req.url = req.url.slice(prefix.length) || '/';
      break;
    }
  }

  next();
});

apiApp.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  next();
});

apiApp.options(['/', '/:collectionName', '/:collectionName/:id'], (_req, res) => {
  res.sendStatus(204);
});

apiApp.get('/', (_req, res) => {
  res.json({
    collections: collectionNames,
    message: 'ShotPlan API',
  });
});

apiApp.get('/:collectionName', async (req, res, next) => {
  try {
    const collectionName = parseCollectionName(req.params.collectionName);

    if (!collectionName) {
      res.sendStatus(404);
      return;
    }

    const db = await readDatabase();
    res.json(db[collectionName]);
  } catch (error) {
    next(error);
  }
});

apiApp.get('/:collectionName/:id', async (req, res, next) => {
  try {
    const collectionName = parseCollectionName(req.params.collectionName);

    if (!collectionName) {
      res.sendStatus(404);
      return;
    }

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

apiApp.post('/:collectionName', async (req, res, next) => {
  try {
    const collectionName = parseCollectionName(req.params.collectionName);

    if (!collectionName) {
      res.sendStatus(404);
      return;
    }

    const db = await readDatabase();
    const entity = { ...req.body, id: createId() };

    db[collectionName] = [...db[collectionName], entity];
    await writeDatabase(db);

    res.status(201).json(entity);
  } catch (error) {
    next(error);
  }
});

apiApp.patch('/:collectionName/:id', async (req, res, next) => {
  try {
    const collectionName = parseCollectionName(req.params.collectionName);

    if (!collectionName) {
      res.sendStatus(404);
      return;
    }

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

apiApp.delete('/:collectionName/:id', async (req, res, next) => {
  try {
    const collectionName = parseCollectionName(req.params.collectionName);

    if (!collectionName) {
      res.sendStatus(404);
      return;
    }

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

async function readDatabase(): Promise<Database> {
  if (isNetlifyRuntime) {
    netlifyDatabase ??= cloneDatabase(databaseSeed as Database);

    return netlifyDatabase;
  }

  const rawDatabase = await readFile(dbPath, 'utf-8');

  return JSON.parse(rawDatabase) as Database;
}

async function writeDatabase(database: Database): Promise<void> {
  if (isNetlifyRuntime) {
    netlifyDatabase = cloneDatabase(database);

    return;
  }

  await writeFile(dbPath, `${JSON.stringify(database, null, 2)}\n`);
}

function parseCollectionName(value: string | undefined): CollectionName | null {
  return collectionNames.includes(value as CollectionName) ? (value as CollectionName) : null;
}

function cloneDatabase(database: Database): Database {
  return JSON.parse(JSON.stringify(database)) as Database;
}

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
