export interface PokemonListResponse {
    count:    number;
    next:     string;
    previous: string;
    results:  PokemonItem[];
}

interface PokemonItem {
    name: string;
    url:  string;
}
