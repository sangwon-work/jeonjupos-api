export interface Configuration {
  node_env: string;

  port: number;

  database: {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    connectionLimit: number;
  };

  jwt: {
    secret: string;
  };

  awsconfig: {
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    s3Region: string;
    s3Bucket: string;
  };
}
