// MUST BE FIRST
require('dotenv').config();
import config from './config';
import { createConnection } from 'typeorm';



// Base
import DefaultEnvVarsInitializer from './services/DefaultEnvVarsInitializer';
import { Logger } from './services/Logger';
import PublicTenderService from './services/PublicTenderService';

(async () => {

    const logger = new Logger('App');
    logger.log(`Initializing in ${process.env.NODE_ENV} mode...`);

    await DefaultEnvVarsInitializer.initialize();

    const http = require('http');

    /***********************************************************************/

    /**
     * Inicio del servidor web y de la base de datos
     */
    const server = http.createServer((req, res) => {

        // Respuesta
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hola Mundo\n');
    });

    server.listen(process.env.PORT, async () => {
        logger.log('App is listening on port: ' + process.env.PORT);
        logger.log('Connecting to database...');
        createConnection(config.getOrmConfig()).then(async connection => {
            logger.log('Database successfully connected: ' + connection.name);
            logger.log('Service is ready!');
        }).catch(e => {
            logger.error('Database error:', e);
            process.exit(1);
        });
        logger.log('Running the service...');
        await PublicTenderService.initialize();
        logger.log('Finish the service...');

    });

})();
