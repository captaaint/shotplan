import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'sessions/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'sessions/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'clients/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'leads/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'locations/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'packages/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
