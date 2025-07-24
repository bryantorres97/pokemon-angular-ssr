import { map, startWith, Subscription, tap } from 'rxjs';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonList } from '../../pokemons/components/pokemon-list/pokemon-list';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonList, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage implements OnInit, OnDestroy {
  public isLoading = signal(true);
  private appRef = inject(ApplicationRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pokemonsService = inject(PokemonsService);
  private title = inject(Title);

  public pokemons = signal<SimplePokemon[]>([]);
  private appRef$: Subscription;

  public currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map((params) => parseInt(params.get('page') || '1', 10)),
      map((page) => (isNaN(page) || page < 1 ? 1 : page)),
      startWith(1),
    )
  );

  constructor() {
    console.log('PokemonsPage initialized');
    this.appRef$ = this.appRef.isStable.subscribe((isStable) => {
      console.log('Application stability:', isStable);
    });
  }

  ngOnInit(): void {
  console.log(this.currentPage());
    this.loadPokemons(0);
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
    this.pokemonsService.loadPage(pageToLoad)
    .pipe(
      tap(() => {
        this.router.navigate([], {
          queryParams: { page: pageToLoad },
          queryParamsHandling: 'merge',
        })
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
