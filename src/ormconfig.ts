require('dotenv').config();

import * as strategies from 'typeorm-naming-strategies';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const s = process.env.npm_lifecycle_script;
const isDevMode = s === 'nodemon' ||
    (s && !!s.match(/^ts-node/)) ||
    (s && !!s.match(/^fixtures/));

const ormConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: process.env.DATABASE_ADDRESS,
    port: +process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    timezone: process.env.TZ,
    synchronize: false,
    logging: process.env.DATABASE_LOGGING === 'true',
    namingStrategy: new strategies.SnakeNamingStrategy(),
    entities: [
        isDevMode ? 'src/entities/**/*.ts' : 'dist/entities/**/*.js'
    ],
    migrations: [
        isDevMode ? 'src/migration/**/*.ts' : 'dist/migration/**/*.js'
    ],
    subscribers: [
        isDevMode ? 'src/subscriber/**/*.ts' : 'dist/subscriber/**/*.js'
    ],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    }
};

export = ormConfig;
