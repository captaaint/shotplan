import { apiApp } from './api-app';

const port = Number(process.env['API_PORT'] ?? 4000);

apiApp.listen(port, () => {
  console.log(`ShotPlan API listening on http://localhost:${port}/api`);
});
