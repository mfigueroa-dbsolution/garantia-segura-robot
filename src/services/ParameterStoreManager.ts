import * as AWS from 'aws-sdk';
import * as sprint from 'sprintf-js';
import { PSParameterValue } from 'aws-sdk/clients/ssm';
import { Logger } from './Logger';
import config from '../config';

class ParameterStoreManager {

    private logger = new Logger(this.constructor.name);

    public async getParameter(name: string): Promise<PSParameterValue> {

        // Si el entorno actual no es un entorno desplegado en AWS, no hay valor
        if (config.awsEnvironments.indexOf(process.env.NODE_ENV) === -1) {
            return null;
        }

        name = sprint.sprintf(name, {
            env: process.env.NODE_ENV
        });

        const params: AWS.SSM.Types.GetParameterRequest = {
            Name: name,
            WithDecryption: true
        };

        const ssm = new AWS.SSM({region: process.env.AWS_REGION});

        this.logger.log('Getting parameter from SSM: ' + name);
        return new Promise((resolve, reject) => {
            ssm.getParameter(params, (err, data) => {
                if (err) { reject(err); }
                resolve(data.Parameter.Value);
            });
        });
    }
}

export default new ParameterStoreManager();
