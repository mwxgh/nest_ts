import * as Joi from '@hapi/joi'

// sample postgres database configuration
// eslint-disable-next-line
const postgresConfiguration = {
  dbConnection: 'postgres',
  dbHost: 'localhost',
  dbPort: 5432,
}

const mysqlConfiguration = {
  dbConnection: 'mysql',
  dbHost: 'localhost',
  dbPort: 3306,
}

const validationSchema = Joi.object({
  APP_NAME: Joi.string().default('NEST_TS'),
  APP_ENV: Joi.string()
    .valid('local', 'production', 'test', 'staging')
    .default('local'),
  APP_KEY: Joi.string(),
  APP_DEBUG: Joi.bool().default('false'),

  FILE_UPLOAD_DESTINATION: Joi.string().required(),
  FILE_UPLOAD_MAX_SIZE: Joi.number().required(),

  JWT_TTL: Joi.number().required(),
  JWT_REFRESH_TTL: Joi.number().required(),

  DB_CONNECTION: Joi.string()
    .valid(
      'mysql',
      'mariadb',
      'postgres',
      'cockroachdb',
      'sqlite',
      'mssql',
      'oracle',
      'mongodb',
      'cordova',
      'react-native',
      'expo',
      'nativescript',
    )
    .default(mysqlConfiguration.dbConnection)
    .required(),
  DB_HOST: Joi.string().required().default(mysqlConfiguration.dbHost),
  DB_PORT: Joi.number().required().default(mysqlConfiguration.dbPort),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_LOGGING: Joi.bool(),

  MAIL_MAILER: Joi.string().allow('').optional(),
  MAIL_HOST: Joi.string().allow('').optional(),
  MAIL_PORT: Joi.number().allow('').optional(),
  MAIL_USERNAME: Joi.string().allow('').optional(),
  MAIL_PASSWORD: Joi.string().allow('').optional(),
  MAIL_ENCRYPTION: Joi.string().allow('').optional(),
  MAIL_FROM_ADDRESS: Joi.string().email().allow('').allow('null').optional(),
  MAIL_FROM_NAME: Joi.string().allow('').optional(),
  PORT: Joi.number().default(3000),
})

export default validationSchema
