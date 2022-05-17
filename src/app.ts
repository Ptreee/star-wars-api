require('express-async-errors');
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import express from 'express';
import sequelize from './db/connect';
// [extra security]
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// [imports] utils
import { getAllCharacters } from './utils/getAllCharacters';
import { getAllMovies } from './utils/getMovies';
import { createConnections } from './utils/createConnections';
// [imports] routes
import filmsRouter from './routes/films.routes';
import favoritesRouter from './routes/favorites.routes';
// [imports] middleware
import notFound from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
// [docs]
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

dotenv.config();
const app = express();
app.use(express.json());
app.set('trust proxy', 1);
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// [routes] utility
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>StarWars API v.1.0</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// [routes] API
app.use('/api/v1/films', filmsRouter);
app.use('/api/v1/favorites', favoritesRouter);

// [middleware] 404 & error
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = Number(process.env.APP_PORT) || 8000;
const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    await getAllCharacters();
    await getAllMovies();
    await createConnections();
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};
start();
