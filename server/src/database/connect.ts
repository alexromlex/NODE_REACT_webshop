import 'dotenv/config';
require('pg').defaults.parseInt8 = true; // returns type.BIGINT to number
import { Sequelize } from 'sequelize';
// import fs from 'fs';
// import path from 'path';
// import { DataTypes } from 'sequelize';

const dbConfig =
  process.env.NODE_ENV === 'test'
    ? {
        database: 'node_react_webshop_test',
        username: 'postgres',
        password: 'admin',
        host: '127.0.0.1',
      }
    : {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: String(process.env.DB_PASSWORD),
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
      };
const sequelize = new Sequelize(dbConfig.database!, dbConfig.username!, dbConfig.password, {
  ...dbConfig,
  dialect: 'postgres',
});
export default sequelize;
