import pool from "../db_connection"

export async function getUser(userName: string) {
    console.log("getUser invoked")
    let user = null;
    let query = `SELECT * FROM users WHERE username = '${userName}'`
    try {
        let result = await pool.query(query);
        user = result.rows[0];
    } catch (err: any) {
        throw {
            statusCode: 500,
            message: err.message
        }
    } finally {
        return user;
    }
}

export async function createUser(uuid: string, userName: string, password: string) {
    let query = `INSERT INTO users (user_id, username, password) VALUES ('${uuid}', '${userName}', '${password}')`
    try {
        let res = await pool.query(query);
    } catch (error: any) {
        if (error.code && error.code === 23505) {
            throw {
                statusCode: 409,
                message: "User already exists"
            }
        } else {
            throw {
                statusCode: 500,
                message: error.message
            }
        }
    }
}