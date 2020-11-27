import config from '../config';
import ParameterStoreManager from './ParameterStoreManager';

class DefaultEnvVarsInitializer {

    async initialize(): Promise<void> {

        /**
         * Seteo de variables de entorno faltantes con
         * sus respectivas valores por defecto
         */
        const vars = config.envVarsDefaults[process.env.NODE_ENV];

        for (const varName in vars) {
            if (vars.hasOwnProperty(varName)) {
                if (!process.env.hasOwnProperty(varName)) {
                    process.env[varName] = vars[varName];
                }
            }
        }

        /**
         * Seteo de variables de entorno faltantes con
         * sus respectivas valores en AWS Parameter Store
         */
        const params = config.awsParameterStore;

        for (const paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                if (!process.env.hasOwnProperty(paramName)) {
                    process.env[paramName] = await ParameterStoreManager.getParameter(
                        params[paramName]
                    );
                }
            }
        }
    }
}

export default new DefaultEnvVarsInitializer();
