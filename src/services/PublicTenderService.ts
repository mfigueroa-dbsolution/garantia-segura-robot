import * as AWS from 'aws-sdk';
import { v5 as uuidv5 } from 'uuid';
import { Logger } from './Logger';
import fetch from 'node-fetch';
import * as moment from 'moment-timezone';
import UserRepository from '../repositories/UserRepository';
import { format } from 'rut.js';

class PublicTenderService {

    private logger = new Logger(this.constructor.name);

    private ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

    async initialize(ttl = 31536000000): Promise<void> {

        // Se estará ejecutando continuamente
        do {

        // Tomamos la fecha de AHORA (America/Santiago) al formato DDMMYYYY
        const date = moment.tz('America/Santiago').format('DDMMYYYY');

        // Buscar todas las licitaciones (Todas) de la fecha de ahora
        const urlTenederList = `${process.env.TENDER_URL}?fecha=${date}&estado=Todos&ticket=${process.env.TENDER_ACCESS_TICKET}`;

        try {
            const jsonTenderList = await this.runnigRecursiveFetch(urlTenederList, ttl);

            await this.saveJson(urlTenederList, ttl, jsonTenderList);

            // Para cada una de las licitaciones, buscar el detalle de la licitación por id
            const tenderList = await Object(this.getData(urlTenederList, ttl));

            for (const tender of tenderList.Listado) {

                const urlTenderDetail = `${process.env.TENDER_URL}?codigo=${tender.CodigoExterno}&ticket=${process.env.TENDER_ACCESS_TICKET}`;
                const jsonTenderDetail = Object(await this.runnigRecursiveFetch(urlTenderDetail, ttl));
                if (jsonTenderDetail.Cantidad) {
                    await this.saveJson(urlTenderDetail, ttl, jsonTenderDetail);
                }
            }

            /*
            // Obtener los usuarios regitrados de la Plataforma
            const listUser = await UserRepository.findAll();

            for (const user of listUser) {
                const urlProviderList = `${process.env.PROVIDER_URL}?rutempresaproveedor=${format(user.rut)}&ticket=${process.env.TENDER_ACCESS_TICKET}`;
                const jsonProviderList = Object(await this.runnigRecursiveFetch(urlProviderList, ttl));
                if (jsonProviderList.Cantidad) {
                    await this.saveJson(urlProviderList, ttl, jsonProviderList);
                }

            }
            */

        } catch (error) {
            this.logger.log(`Se produjo el siguiente  ${error}`);
        }

        } while (true);


    }

    private runnigRecursiveFetch(url: string, ttl: number): void | PromiseLike<void> {
        return new Promise((resolve, reject) => {

            const recursiveFetch = (attemp: number) => {
                this.runningfetchJSON(url, ttl)
                    .then(json => {
                        // 10500 = Lo sentimos. Hemos detectado que existen peticiones simultáneas.
                        if (json.hasOwnProperty('Codigo') && json.Codigo === 10500) {
                            this.logger.log(`Reintentando ${attemp} ...`);
                            setTimeout(() => {
                                recursiveFetch(++attemp);
                            }, 250);
                        } else {
                            resolve(json);
                        }
                    })
                    .catch(err => {
                        this.logger.error(err);
                        recursiveFetch(++attemp);
                        reject(err);
                    });
            };

            recursiveFetch(1);
        });
    }

    private async getData(urlTenederList: string, ttl: number): Promise<any> {
        this.logger.log('Buscando informacion desde DynamoDB');
        let item: AWS.DynamoDB.Types.AttributeMap = await this.getFromDynamoDB(urlTenederList);

        if (item) {
            // Recuperamos un JSON estandar
            item = AWS.DynamoDB.Converter.unmarshall(item);

            // Si expiro el registro pero aun existe en la base de datos, lo marcamos como no encontrado
            if (item.ttl < Math.trunc(new Date().getTime() / 1000)) {
                this.logger.log(`El cache aún sigue presente pero ha expirado. (ttl: ${ttl})`);
                item = null;
            }
        } else {
            this.logger.log('No se ha encontrado cache para esta URL.');
        }

        this.logger.log('Devolviendo información desde DynamoDB');

        return item.data;
    }

    async saveJson(url: string, ttl: number, json: any): Promise<any> {

        try {

            this.logger.log('Almacenando la respuesta');
            await this.saveToDynamoDB(url, json, ttl);
            this.logger.log('respuesta almacenada');
            return json;

        } catch (error) {
            this.logger.error(`No se pudo almacenar en DynamoDB`, error);
        }

        this.logger.log('Devolviendo información desde DynamoDB');
        return json;

    }

    private runningfetchJSON(url: string, ttl?: number): Promise<any> {
        return fetch(url).then(res => res.json());
    }

    private saveToDynamoDB(url: string, data: any, ttl: number): Promise<AWS.DynamoDB.Types.PutItemOutput> {
        return new Promise((resolve, reject) => {

            this.logger.log(`url:${url}, key: ${uuidv5(url, uuidv5.URL)}`);
            const params: AWS.DynamoDB.Types.PutItemInput = {
                TableName: process.env.DYNAMO_DB_TABLE_PROXY_CACHE,
                Item: {
                    key: { S: uuidv5(url, uuidv5.URL) },
                    data: { M: AWS.DynamoDB.Converter.marshall(data) },
                    ttl: { N: `${Math.trunc(new Date().getTime() / 1000) + ttl}` },
                }
            };

            this.ddb.putItem(params, (err, output) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
    }

    private getFromDynamoDB(url: string): Promise<AWS.DynamoDB.Types.AttributeMap> {
        return new Promise((resolve, reject) => {

            const params: AWS.DynamoDB.Types.GetItemInput = {
                TableName: process.env.DYNAMO_DB_TABLE_PROXY_CACHE,
                Key: {
                    key: { S: uuidv5(url, uuidv5.URL) }
                }
            };

            this.ddb.getItem(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item);
                }
            });
        });
    }

}

export default new PublicTenderService();
