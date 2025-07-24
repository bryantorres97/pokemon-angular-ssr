import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import { Pokemon } from '../../pokemons/interfaces';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemon-page',
  imports: [],
  templateUrl: './pokemon-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPage implements OnInit {
  public id = input<string | undefined>();
  public internalId = linkedSignal(() => this.id() || '0');
  private title = inject(Title);
  private meta = inject(Meta);

  public pokemon = signal<Pokemon | null>(null);
  private pokemonsService = inject(PokemonsService);

  ngOnInit(): void {
    this.getPokemon();
  }

  private getPokemon(): void {
    if (!this.id()) {
      this.pokemon.set(null);
      return;
    }

    this.pokemonsService
      .loadPokemon(this.id()!)
      .pipe(tap((pokemon) => {
        this.title.setTitle(`${this.capitalizeFirstLetter(pokemon.name)}`);
        this.meta.updateTag({ name: 'description', content: `Información sobre ${pokemon.name}` });
        this.meta.updateTag({ name: 'og:title', content: pokemon.name });
        this.meta.updateTag({ name: 'og:description', content: `Detalles de ${pokemon.name}` });
        this.meta.updateTag({ name: 'og:image', content: pokemon.sprites.other?.['official-artwork']?.front_default || '' });
        this.meta.updateTag({ name: 'twitter:title', content: pokemon.name });
        this.meta.updateTag({ name: 'twitter:description', content: `Detalles de ${pokemon.name}` });
        this.meta.updateTag({ name: 'twitter:image', content: pokemon.sprites.other?.['official-artwork']?.front_default || '' });
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'og:type', content: 'profile' });
      }))
      .subscribe({
        next: (pokemon) => {
          this.pokemon.set(pokemon);
          this.internalId.set(pokemon.id.toString());
          console.log('Pokemon loaded:', pokemon.name);
        },
        error: (error) => {
          console.error('Error loading pokemon:', error);
          this.pokemon.set(null);
        },
      });
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      fire: 'bg-red-600',
      water: 'bg-blue-600',
      grass: 'bg-green-600',
      electric: 'bg-yellow-500 text-black',
      psychic: 'bg-pink-500',
      ice: 'bg-cyan-300 text-black',
      dragon: 'bg-purple-700',
      dark: 'bg-gray-800',
      fairy: 'bg-pink-300 text-black',
      normal: 'bg-gray-400 text-black',
      fighting: 'bg-orange-700',
      flying: 'bg-indigo-400',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      rock: 'bg-yellow-800',
      bug: 'bg-lime-500 text-black',
      ghost: 'bg-indigo-800',
      steel: 'bg-gray-500',
    };
    return colors[type] ?? 'bg-gray-400 text-white';
  }

  playCry(url?: string): void {
    console.log('Playing cry for URL:', url);
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.error('No se pudo reproducir el audio:', err);
    });
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
