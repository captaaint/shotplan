import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import {
  getAllowedHosts,
  getContext,
  getTrustProxyHeaders,
} from '@netlify/angular-runtime/app-engine.js';

const isNetlifyRuntime =
  process.env['NETLIFY'] === 'true' || Boolean(process.env['AWS_LAMBDA_FUNCTION_NAME']);
const fallbackAllowedHosts = ['localhost', '127.0.0.1', 'shotplan-1.netlify.app'];

const angularAppEngine = new AngularAppEngine({
  allowedHosts: isNetlifyRuntime
    ? [...new Set([...getAllowedHosts(), ...fallbackAllowedHosts])]
    : fallbackAllowedHosts,
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
