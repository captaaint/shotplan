import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import {
  getAllowedHosts,
  getContext,
  getTrustProxyHeaders,
} from '@netlify/angular-runtime/app-engine.js';

const isNetlifyRuntime = process.env['NETLIFY'] === 'true';

const angularAppEngine = new AngularAppEngine({
  allowedHosts: isNetlifyRuntime ? getAllowedHosts() : ['localhost', '127.0.0.1'],
  trustProxyHeaders: isNetlifyRuntime ? getTrustProxyHeaders() : [],
});

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = isNetlifyRuntime ? getContext() : undefined;
  const result = await angularAppEngine.handle(request, context);

  return result || new Response('Not found', { status: 404 });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
