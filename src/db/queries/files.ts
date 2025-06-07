import { IFileData, getFileStatus } from "../../structs/file_data";
import pool from "../db_connection";

export async function addFileRecord(fileData: IFileData) {
    const query = {
        text: `INSERT INTO files (user_id, original_filename, storage_path, title, description, status, extracted_data) 
              VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [
            fileData.user_id,
            fileData.original_filename,
            fileData.storage_path,
            fileData.title,
            fileData.description,
            getFileStatus(fileData.status),
            fileData.extracted_data
        ]
    };

    try {
        console.log('Executing query:', query.text, 'with values:', query.values);
        const result = await pool.query(query);
        console.log('insert file record response - '+ JSON.stringify(result))
        if (result.rows.length === 0) {
            throw new Error("Failed to add file record.");
        }
        return result.rows[0].id; // Return the inserted record's ID
    } catch (error: any) {
        console.error('Error in addFileRecord:', error);
        throw {
            statusCode: 500,
            message: error.message
        };
    }
}