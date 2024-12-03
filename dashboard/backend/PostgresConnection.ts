import { Pool } from 'pg';

export const pgConn = new Pool({
    // user: process.env.PGUSER,
    // host: process.env.PGHOST,
    // database: process.env.PGDATABASE,
    // password: process.env.PGPASSWORD,
    // port: (process.env.PGPORT as unknown as number),
     host: process.env.AZURE_POSTGRESQL_HOST,
     user: process.env.AZURE_POSTGRESQL_USER,
     password: process.env.AZURE_POSTGRESQL_PASSWORD,
     database: process.env.AZURE_POSTGRESQL_DATABASE,
     port: Number(process.env.AZURE_POSTGRESQL_PORT) ,
     ...( process.env.AZURE_POSTGRESQL_SSL ? {ssl: { rejectUnauthorized: false }} : {})
});
