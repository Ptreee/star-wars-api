import * as XLSX from 'xlsx';
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { movieIdCleaner, listNameCleaner } from '../utils/userInputCleaner';
import { Character, Movie, favList, favList_Movie } from '../models';
import { FavListInterface, CharacterInterface } from '../utils/interface';

export const createFavorites = async (req: Request, res: Response) => {
  try {
    const { list_name, movie_id } = req.body;
    // [Input] sanitizing
    const cleanListName = listNameCleaner(list_name);
    if (!cleanListName || cleanListName.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Please provide name for the list' });
    }
    const cleanMovieId = movieIdCleaner(movie_id);
    if (!cleanMovieId || cleanMovieId.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Please provide valid movie IDs [from 1 to 6]',
      });
    }
    // [check] if favList name already exists.
    const entryExistence = await favList.findOne({
      where: {
        list_name: cleanListName,
      },
    });
    if (entryExistence !== null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Favorite list name already taken, please provide another one.',
      });
    }
    // [Getting Movie details for Response]
    const rawFavList = await Movie.findAll({
      where: { movie_id: cleanMovieId },
      attributes: { exclude: ['charactersInMovie'] },
      include: [
        {
          model: Character,
          nested: true,
          attributes: {
            exclude: ['character_id', 'filmID'],
          },
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    // [Insert] into favList table
    const entry = await favList.create({
      list_name: cleanListName,
      movies: cleanMovieId,
    });
    // @ts-ignore
    const { favList_id }: { favList_id: number } = entry.dataValues;

    // [Insert] into junction table
    cleanMovieId.map(async (item) => {
      await favList_Movie.bulkCreate([{ favList_id, movie_id: item }]);
    });
    return res.status(StatusCodes.CREATED).json({
      msg: 'Success! New list created',
      list_id: favList_id,
      list_name: cleanListName,
      movies: rawFavList,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'List creation failed',
      error: error.original.detail,
    });
  }
};

export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const { list_name, page, pageSize } = req.body;
    // [Pagination]
    const paginate = (
      list_name: string[],
      { page, pageSize }: { page: number; pageSize: number },
    ) => {
      const offset = (page - 1) * pageSize;
      const limit = pageSize;
      return { ...list_name, offset, limit };
    };

    const list: object = await favList.findAndCountAll(
      paginate(
        {
          // @ts-ignore
          where: {
            list_name: {
              [Op.substring]: list_name,
            },
          },
          attributes: { exclude: ['movies'] },
          raw: true,
        },
        { page, pageSize },
      ),
    );

    return res.status(StatusCodes.OK).json({ data: list });
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'Action Failed, please try later',
      error: error.original.detail,
    });
  }
};
export const getSingleFavorite = async (req: Request, res: Response) => {
  const { id: requestedID } = req.params;
  try {
    const result = await favList.findOne({
      where: {
        favList_id: requestedID,
      },
      attributes: { exclude: ['movies'] },
      include: [
        {
          model: Movie,
          attributes: { exclude: ['movie_id', 'charactersInMovie'] },
          through: { attributes: [] },
          include: [
            {
              model: Character,
              attributes: { exclude: ['character_id', 'filmID'] },
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    return res.status(StatusCodes.OK).json({ data: result });
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'Action Failed, please try later',
      error: error.original.detail,
    });
  }
};

export const getSingleFavoriteFile = async (req: Request, res: Response) => {
  const { id: requestedID } = req.params;
  try {
    // [DATA SEARCH]
    // @ts-ignore
    const data: FavListInterface = await favList.findOne({
      where: {
        favList_id: requestedID,
      },
    });
    const moviesInFavList = data!.movies;
    // @ts-ignore
    const result: FavListInterface = await favList.findOne({
      where: {
        favList_id: requestedID,
      },
      include: [
        {
          model: Movie,
          attributes: { exclude: ['movie_id', 'charactersInMovie'] },
          through: { attributes: [] },
          include: [
            {
              model: Character,
              attributes: { exclude: ['character_id', 'filmID'] },
              through: { attributes: [] },
              include: [
                {
                  model: Movie,

                  where: { movie_id: moviesInFavList },

                  attributes: {
                    exclude: ['movie_id', 'releaseDate', 'charactersInMovie'],
                  },
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });
    let dataFromSearch = result!.Movies.flatMap(
      (item: { Characters: object[] }) => item.Characters,
    );

    // [filter uniques]

    const cleanFromDuplicatesData = [
      ...new Map(
        dataFromSearch.map((item: MapConstructor) => [item['name'], item]),
      ).values(),
    ];

    // [movies transform] from object to string
    let dataToSheet = cleanFromDuplicatesData.map(
      // @ts-ignore
      (character: CharacterInterface) => {
        let movies = character.Movies.map((movie) => movie.movieTitle).join(
          ', ',
        );
        return { name: character.name, movies };
      },
    );

    // [create EXCEL file]
    const workSheet = XLSX.utils.json_to_sheet(dataToSheet);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'characters');
    XLSX.utils.sheet_add_aoa(workSheet, [['Name', 'Movies']], {
      origin: 'A1',
    });
    const max_width = dataToSheet.reduce(
      (w, r) => Math.max(w, r.name.length),
      10,
    );
    workSheet['!cols'] = [{ wch: max_width }];
    XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
    XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' });
    XLSX.writeFile(workBook, 'starWarsCharacters.xlsx');

    return res.status(StatusCodes.OK).download('starWarsCharacters.xlsx');
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'Action Failed, please try later',
      error: error.original.detail,
    });
  }
};
