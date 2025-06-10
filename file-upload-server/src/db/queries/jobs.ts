import { getJobStatus, getJobType, IJobData } from "../../structs/job_data";
import pool from "../db_connection";

export async function createJob(jobData: IJobData) {
    const query = {
        text: 'INSERT INTO jobs (file_id, job_type, status, error_message, started_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        values: [
            jobData.file_id,
            getJobType(jobData.job_type),
            getJobStatus(jobData.status),
            jobData.error_message,
            jobData.started_at
        ]
    }
    try {
        let result = await pool.query(query);
        if (result.rows.length === 0) {
            throw new Error("Failed to create job.");
        }
        return result.rows[0].id;
    } catch (error: any) {
        throw {
            statusCode: 500,
            message: error.message
        }
    }
}