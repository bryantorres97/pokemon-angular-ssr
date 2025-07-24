import { map, startWith, Subscription, tap } from 'rxjs';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonList } from '../../pokemons/components/pokemon-list/pokemon-list';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonList, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage implements OnInit, OnDestroy {
  public id = input<string | undefined>();
  public isLoading = signal(true);
  private appRef = inject(ApplicationRef);
  private router = inject(Router);
  private pokemonsService = inject(PokemonsService);
  private title = inject(Title);

  public pokemons = signal<SimplePokemon[]>([]);
  private appRef$: Subscription;

  public currentPage = computed(() => {
    const raw = this.id();
    const parsed = parseInt(raw || '1', 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  });

  constructor() {
    console.log('PokemonsPage initialized');
    this.appRef$ = this.appRef.isStable.subscribe((isStable) => {
      console.log('Application stability:', isStable);
    });
  }

  ngOnInit(): void {
    console.log(this.currentPage());
    this.loadPokemons(this.currentPage() -1);
    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 3000);
  }

  ngOnDestroy(): void {
    if (this.appRef$) {
      this.appRef$.unsubscribe();
    }
    console.log('PokemonsPage destroyed');
  }

  public loadPokemons(page: number = 0): void {
    const pageToLoad = this.currentPage()! + page;
    console.log('Loading page:', pageToLoad);
    this.pokemonsService
      .loadPage(pageToLoad)
      .pipe(
        tap(() => {
          this.router.navigateByUrl(`/pokemons/${pageToLoad}`, {
            skipLocationChange: true,
          });
          this.title.setTitle(`Pokémon - Page ${pageToLoad}`);
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
