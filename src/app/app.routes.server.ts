import { RenderMode, ServerRoute } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [
  {
    path: 'product-detail/:id',
    renderMode: RenderMode.Server, // ⚡ Render dynamically
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
