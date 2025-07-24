import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemons/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const pokemonsPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      return pokemonsPages.map((id) => ({ id: id.toString() }));
    },
  },
  {
    path: 'pokemon/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
