# garantia-segura-robot

Como iniciar el proyecto:

0. Tener instalado de maneja global:
- typescript (`npm install typescript -g`)
- tslint (`npm install tslint -g`)
- ts-node (`npm install ts-node -g`)

1. Ejecutar el comando `npm i` o `npm install` 
2. Configurar las variables de entorno del proyecto creando un archivo `.env` a la raíz del proyecto basandose en el archivo `.env.sample`
3. Compilar el proyecto usando `npm run compile`
3. Ejecutar el comando `npm start`


Comprobar la calidad del codigo usando el comando:
```
npm run lint
```

## Crear las instancias con Elastic Beanstalk

### DEV

Crear un environment Elastic Beanstalk
```
eb create garantia-segura-robot-dev \
    --single \
    --instance_type t3.small \
    --envvars NODE_ENV=dev \
    --vpc.id vpc-0079f7a8cf3982e88 \
    --vpc.ec2subnets subnet-0b39d116ed112e914,subnet-0e86b3729a08ee7a3,subnet-0dff289e432e2c0e2 \
    --instance_profile dev-instance-profile \
    --cname garantia-segura-robot-dev \
    --env-group-suffix dev
```

Despleguar sobre un environment Elastic Beanstalk existente
```
eb deploy garantia-segura-robot-dev
```

Terminar un environment Elastic Beanstalk existente
``` 
eb terminate garantia-segura-robot-dev
```

### QA

Crear un environment Elastic Beanstalk
```
eb create garantia-segura-robot-qa \
    --single \
    --instance_type t3.small \
    --envvars NODE_ENV=qa \
    --vpc.id vpc-0b0881f4212183a11 \
    --vpc.ec2subnets subnet-0371655aac09ec0e3,subnet-065fc55909784faa4,subnet-0b656378c0b45c404 \
    --instance_profile qa-instance-profile \
    --cname garantia-segura-robot-qa \
    --env-group-suffix qa
```

Despleguar sobre un environment Elastic Beanstalk existente
```
eb deploy garantia-segura-robot-qa
```

Terminar un environment Elastic Beanstalk existente
``` 
eb terminate garantia-segura-robot-qa
```

### PROD

Crear un environment Elastic Beanstalk
```
eb create garantia-segura-robot-prod \
    --single \
    --instance_type t3.small \
    --envvars NODE_ENV=prod \
    --vpc.id vpc-02c46d19489f33a4f \
    --vpc.ec2subnets subnet-0ca573125fc104d82,subnet-0f2bc52dba1de3aae,subnet-05b4965be53435dc2 \
    --instance_profile prod-instance-profile \
    --cname garantia-segura-robot-prod \
    --env-group-suffix prod
```

Despleguar sobre un environment Elastic Beanstalk existente
```
eb deploy garantia-segura-robot-prod
```

Terminar un environment Elastic Beanstalk existente
``` 
eb terminate garantia-segura-robot-prod
```

TODO:

https://aws.amazon.com/es/premiumsupport/knowledge-center/elastic-beanstalk-https-configuration/
