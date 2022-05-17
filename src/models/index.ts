import Movie from './Movie';
import Character from './Character';
import favList from './favList';
import Movie_Character from './Movie_Character';
import favList_Movie from './favList_Movie';

// [ASSOCIATIONS]
Movie.belongsToMany(Character, {
  through: Movie_Character,
  foreignKey: 'movie_id',
});
Character.belongsToMany(Movie, {
  through: Movie_Character,
  foreignKey: 'character_id',
});

favList.belongsToMany(Movie, {
  through: favList_Movie,
  foreignKey: 'favList_id',
});
Movie.belongsToMany(favList, {
  through: favList_Movie,
  foreignKey: 'movie_id',
});

export { Movie, Character, favList, Movie_Character, favList_Movie };
