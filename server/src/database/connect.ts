import 'dotenv/config';
require('pg').defaults.parseInt8 = true; // returns type.BIGINT to number
import { Sequelize } from 'sequelize';
import cls from 'cls-hooked';

let dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
};

if (process.env.NODE_ENV === 'test') {
  dbConfig = {
    database: 'node_react_webshop_test',
    username: 'postgres',
    password: 'admin',
    host: '127.0.0.1',
    port: 5432 + parseInt(process.env.JEST_WORKER_ID!),
  };
}

const namespace = cls.createNamespace('namespace');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(dbConfig.database!, dbConfig.username!, dbConfig.password, {
  ...dbConfig,
  dialect: 'postgres',
});

export default sequelize;
