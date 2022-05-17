import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbPassword = process.env.DB_PASSWORD as string;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: 5432,
  dialect: 'postgres',
});

export default sequelize;
