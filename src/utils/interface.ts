export interface MovieInterface {
  movie_id: number;
  movieTitle: string;
  releaseDate: string;
  charactersInMovie: number[];
}

export interface FavListInterface {
  favList_id: number;
  list_name: string;
  movies?: number[];
  Movies: {
    [x: string]: any;
    movieTitle: string;
    releaseDate: string;
    Characters: [name: string];
  };
}

export interface CharacterInterface {
  character_id: number;
  name: string;
  url: string;
  films: string[];
  filmID: number[];
  Movies: [{ movieTitle: string }];
}
