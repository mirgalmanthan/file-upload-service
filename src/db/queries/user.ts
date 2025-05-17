import pool from "../db_connection"

export async function getUser(userName: string) {
    console.log("getUser invoked")
    let user = null;
    let query = `SELECT * FROM users WHERE username = ${userName}`
    try {
        let result = await pool.query(query);
        user = result.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        return user;
    }
} 

export async function createUser(userName: string, password: string) {
    let query = `INSERT INTO users (username, password) VALUES (${userName}, ${password})`
    let res = await pool.query(query);
    console.log(res)
}