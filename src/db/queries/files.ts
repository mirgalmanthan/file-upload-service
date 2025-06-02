import { FileData, getFileStatus } from "../../structs/file_data";
import pool from "../db_connection";

export async function addFileRecord(fileDate: FileData) {
    let query = `INSERT INTO files (user_id, original_filename, storage_path, title, description, status, extracted_data) VALUES('${fileDate.user_id}', '${fileDate.original_filename}', '${fileDate.storage_path}', '${fileDate.title}', '${fileDate.description}', '${getFileStatus(fileDate.status)}', '${fileDate.extracted_data}')`;
    try {
        console.log(query)
        let resp = await pool.query(query);
    } catch (error: any) {
        throw {
            statusCode: 500,
            message: error.message
        }
    }
}