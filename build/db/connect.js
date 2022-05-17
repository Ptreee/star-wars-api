"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('starWars-API', 'postgres', '1234', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});
exports.default = sequelize;
