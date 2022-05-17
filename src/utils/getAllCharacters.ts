import { Character } from '../models/';
import fetch from 'node-fetch';
import { CharacterInterface } from '../utils/interface';
import { ModelStatic } from 'sequelize/types';

const fetchCharacters = async (page: number) => {
  try {
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Problem with Character fetching');
  }
};

export const getAllCharacters = async () => {
  try {
    // [fetching all characters]
    const characterTable = await Character.findAll({});
    // [existence check]
    if (characterTable.length < 10) {
      let tempCharacters = [];
      for (let i = 1; i < 10; i++) {
        // @ts-ignore
        const data = await fetchCharacters([i]);
        tempCharacters.push(data.results);
      }
      // [creating ID] for each character from provided URLs
      let characters = tempCharacters
        .flat(2)
        .map((char: CharacterInterface) => ({
          character_id: parseInt(char.url.replace(/\D/g, '')),
          name: char.name,
          filmID: char.films.map((film) => {
            return Number(film.replace(/\D/g, ''));
          }),
        }));
      // [insert] data to table
      await Character.bulkCreate(characters, {
        validate: true,
        ignoreDuplicates: true,
      });
    } else {
      console.log(
        `[Characters Table] already populated with ${characterTable.length} records`,
      );
      return;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Character : Data Base problem');
  }
};
