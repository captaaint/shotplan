import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import {
  getAllowedHosts,
  getContext,
  getTrustProxyHeaders,
} from '@netlify/angular-runtime/app-engine.js';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const isNetlifyRuntime = process.env['NETLIFY'] === 'true';

const angularAppEngine = new AngularAppEngine({
  allowedHosts: isNetlifyRuntime ? getAllowedHosts() : ['localhost', '127.0.0.1'],
  trustProxyHeaders: isNetlifyRuntime ? getTrustProxyHeaders() : [],
});

const dbPath = join(process.cwd(), 'db.json');

type CollectionName = 'sessions' | 'clients' | 'leads' | 'locations' | 'packages';
type Entity = { id: string; [key: string]: unknown };
type Database = Record<CollectionName, Entity[]> & { $schema?: string };

const collectionNames: CollectionName[] = ['sessions', 'clients', 'leads', 'locations', 'packages'];
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
};

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const apiResponse = await handleApiRequest(request);

  if (apiResponse) {
    return apiResponse;
  }

  const context = isNetlifyRuntime ? getContext() : undefined;
  const result = await angularAppEngine.handle(request, context);

  return result || new Response('Not found', { status: 404 });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);

async function handleApiRequest(request: Request): Promise<Response | null> {
  const { pathname } = new URL(request.url);

  if (!pathname.startsWith('/api/')) {
    return null;
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const [, , collectionName, id] = pathname.split('/');

  if (!isCollectionName(collectionName)) {
    return jsonResponse({ message: 'Not found' }, 404);
  }

  try {
    switch (request.method) {
      case 'GET':
        return getEntity(collectionName, id);
      case 'POST':
        return createEntity(collectionName, request);
      case 'PATCH':
        return updateEntity(collectionName, id, request);
      case 'DELETE':
        return deleteEntity(collectionName, id);
      default:
        return jsonResponse({ message: 'Method not allowed' }, 405);
    }
  } catch {
    return jsonResponse({ message: 'API request failed' }, 500);
  }
}

async function getEntity(collectionName: CollectionName, id?: string): Promise<Response> {
  const db = await readDatabase();

  if (!id) {
    return jsonResponse(db[collectionName]);
  }

  const entity = db[collectionName].find((item) => item.id === id);

  return entity ? jsonResponse(entity) : jsonResponse({ message: 'Not found' }, 404);
}

async function createEntity(collectionName: CollectionName, request: Request): Promise<Response> {
  const db = await readDatabase();
  const body = (await request.json()) as Record<string, unknown>;
  const entity = { ...body, id: createId() };

  db[collectionName] = [...db[collectionName], entity];
  await writeDatabase(db);

  return jsonResponse(entity, 201);
}

async function updateEntity(
  collectionName: CollectionName,
  id: string | undefined,
  request: Request,
): Promise<Response> {
  if (!id) {
    return jsonResponse({ message: 'Not found' }, 404);
  }

  const db = await readDatabase();
  const body = (await request.json()) as Record<string, unknown>;
  const entityIndex = db[collectionName].findIndex((item) => item.id === id);

  if (entityIndex === -1) {
    return jsonResponse({ message: 'Not found' }, 404);
  }

  const entity = { ...db[collectionName][entityIndex], ...body, id };

  db[collectionName] = db[collectionName].map((item) => (item.id === id ? entity : item));
  await writeDatabase(db);

  return jsonResponse(entity);
}

async function deleteEntity(collectionName: CollectionName, id?: string): Promise<Response> {
  if (!id) {
    return jsonResponse({ message: 'Not found' }, 404);
  }

  const db = await readDatabase();
  const nextCollection = db[collectionName].filter((item) => item.id !== id);

  if (nextCollection.length === db[collectionName].length) {
    return jsonResponse({ message: 'Not found' }, 404);
  }

  db[collectionName] = nextCollection;
  await writeDatabase(db);

  return new Response(null, { headers: corsHeaders, status: 204 });
}

async function readDatabase(): Promise<Database> {
  const rawDatabase = await readFile(dbPath, 'utf-8');

  return JSON.parse(rawDatabase) as Database;
}

async function writeDatabase(database: Database): Promise<void> {
  await writeFile(dbPath, `${JSON.stringify(database, null, 2)}\n`);
}

function isCollectionName(value: string | undefined): value is CollectionName {
  return collectionNames.includes(value as CollectionName);
}

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    headers: corsHeaders,
    status,
  });
}

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
