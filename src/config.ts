import * as cls from 'cls-hooked';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as ormConfig from './ormconfig';

cls.createNamespace('cl.gs.api');

const config = {

    envVarsDefaults: {
        local: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: '05438E33-FFBF-457F-A17B-C2A5A617DD11',

        },
        dev: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: '05438E33-FFBF-457F-A17B-C2A5A617DD11',

        },
        qa: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: '05438E33-FFBF-457F-A17B-C2A5A617DD11',

        },
        prod: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: '05438E33-FFBF-457F-A17B-C2A5A617DD11',

        }
    },
    awsParameterStore: {
        DATABASE_ADDRESS: '/%(env)s/rds/address',
        DATABASE_PORT: '/%(env)s/rds/port',
        DATABASE_NAME: '/%(env)s/rds/name',
        DATABASE_PASSWORD: '/%(env)s/rds/password/master',
        DATABASE_USERNAME: '/%(env)s/rds/username/master',
        DYNAMO_DB_TABLE_PROXY_CACHE: '/%(env)s/dynamo-db/table/proxy-cache',

    },
    awsEnvironments: [
        'dev', 'qa', 'prod'
    ],
    getOrmConfig: (): MysqlConnectionOptions => {
        return Object.assign(ormConfig, {
            host: process.env.DATABASE_ADDRESS,
            port: +process.env.DATABASE_PORT,
            database: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
        });
    }
};

export default config;
