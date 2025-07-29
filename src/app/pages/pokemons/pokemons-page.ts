import { Subscription, tap } from 'rxjs';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonList } from '../../pokemons/components/pokemon-list/pokemon-list';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonList, PokemonListSkeletonComponent, RouterLink],
  templateUrl: './pokemons-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage implements OnDestroy {
  public id = input<string | undefined>();
  public isLoading = signal(true);
  private appRef = inject(ApplicationRef);
  private pokemonsService = inject(PokemonsService);
  private title = inject(Title);

  public pokemons = signal<SimplePokemon[]>([]);
  private appRef$: Subscription;

  public currentPage = computed(() => {
    const raw = this.id();
    const parsed = parseInt(raw || '1', 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  });

  public loadOnPageChanged = effect(() => {
    this.loadPokemons();
  });

  constructor() {
    console.log('PokemonsPage initialized');
    this.appRef$ = this.appRef.isStable.subscribe((isStable) => {
      console.log('Application stability:', isStable);
    });
  }

  ngOnDestroy(): void {
    if (this.appRef$) {
      this.appRef$.unsubscribe();
    }
    this.pokemons.set([]);
    this.loadOnPageChanged.destroy();
    console.log('PokemonsPage destroyed');
  }

  public loadPokemons(): void {
    this.pokemonsService
      .loadPage(this.currentPage())
      .pipe(
        tap(() => {
          this.title.setTitle(`Pokémon - Página ${this.currentPage()}`);
        })
      )
      .subscribe({
        next: (pokemons) => {
          this.pokemons.set(pokemons);
        },
        error: (error) => {
          console.error('Error loading pokemons:', error);
        },
      });
  }
}
