import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PokemonCardComponent } from "../pokemon-card/pokemon-card.component";
import { SimplePokemon } from '../../interfaces';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-list.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonList {

  pokemons = input.required<SimplePokemon[]>();
}
