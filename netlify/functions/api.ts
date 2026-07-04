import serverless from 'serverless-http';

import { apiApp } from '../../src/backend/api-app';

export const handler = serverless(apiApp);
