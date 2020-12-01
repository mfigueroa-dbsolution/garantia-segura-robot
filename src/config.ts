import * as cls from 'cls-hooked';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as ormConfig from './ormconfig';

cls.createNamespace('cl.gs.api');

const config = {

    envVarsDefaults: {
        local: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: 'D15B2C0F-F706-4E0B-B0F5-5B56321FE13A',

        },
        dev: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: 'D15B2C0F-F706-4E0B-B0F5-5B56321FE13A',
            
        },
        qa: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: 'D15B2C0F-F706-4E0B-B0F5-5B56321FE13A',

        },
        prod: {
            TENDER_URL: 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json',
            PROVIDER_URL: 'http://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor',
            TENDER_ACCESS_TICKET: 'D15B2C0F-F706-4E0B-B0F5-5B56321FE13A',

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
        console.log(`${process.env.DATABASE_ADDRESS}, ${process.env.DATABASE_PORT}, ${process.env.DATABASE_NAME}, ${process.env.DATABASE_USERNAME}, ${process.env.DATABASE_PASSWORD}` );
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
