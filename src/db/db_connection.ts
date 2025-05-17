import { Pool } from "pg";


const pool = new Pool({
    user: "postgres",
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: "Manthan@123",
    port: parseInt(process.env.DB_PORT || "5432")
})

export default pool;
