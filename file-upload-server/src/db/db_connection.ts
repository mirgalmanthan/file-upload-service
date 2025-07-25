import { Pool } from "pg";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') dotenv.config();

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432")
})

export default pool;
