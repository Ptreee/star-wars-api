import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('starWars-API', 'postgres', '1234', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

export default sequelize;
