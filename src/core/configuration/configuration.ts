import { ConfigFactory } from '@nestjs/config';
import { config } from 'dotenv';
import { Configuration } from './configuration.interface';
import * as process from 'process';
import * as path from 'path';

if (process.env.NODE_ENV === 'production') {
  config({ path: path.join(__dirname, '/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
  config({ path: path.join(__dirname, '/.env.development') });
} else {
  config({ path: path.join(__dirname, '/.env.local') });
}

const configuration: Configuration = {
  node_env: process.env.NODE_ENV || 'local',

  port: parseInt(process.env.PORT) || 3000,

  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || 'database name',
    connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT) || 10,
  },

  jwt: {
    secret: process.env.JWT_SECRET || '',
  },

  awsconfig: {
    awsAccessKeyId: process.env.AWSACCESSKEYID || '',
    awsSecretAccessKey: process.env.AWSSECRETACCESSKEY || '',
    s3Region: process.env.S3REGION || '',
    s3Bucket: process.env.S3BUCKET || '',
  }
};

const configFunction: ConfigFactory<Configuration> = () => configuration;
export default configFunction;
