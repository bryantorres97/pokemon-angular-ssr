import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pokemon, PokemonListResponse, SimplePokemon } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private http = inject(HttpClient);

  public loadPage(page: number): Observable<SimplePokemon[]> {
    if (page < 1) page = 1;

    const limit = 10;
    const offset = (page - 1) * limit;

    return this.http
      .get<PokemonListResponse>(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )
      .pipe(
        map((response) =>
          response.results.map((item) => ({
            id: this.extractId(item.url),
            name: item.name,
          }))
        )
      );
  }

  public loadPokemon(id: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }

  private extractId(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 2];
  }
}
