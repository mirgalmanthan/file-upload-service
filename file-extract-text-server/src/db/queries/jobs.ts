import { getJobStatus, getJobType, IJobData, JobStatus } from "../../structs/job_data";
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

export async function updateJobStatus(fileId: string, status: JobStatus) {
    let textQuery = status == JobStatus.COMPLETED ? `UPDATE jobs SET status = $1, completed_at = $2 WHERE id = $3 RETURNING id`:`UPDATE jobs SET status = $1 WHERE id = $2 RETURNING id`
    let values = status == JobStatus.COMPLETED ? [getJobStatus(status), new Date(), fileId]:[getJobStatus(status), fileId]
    const query = {
        text: textQuery,
        values: values
    }
    try {
        console.log('Executing query:', query.text, 'with values:', query.values);
        const result = await pool.query(query);
        console.log('update job record response - '+ JSON.stringify(result))
        if (result.rows.length === 0) {
            throw new Error("Failed to update job record.");
        }
        return result.rows[0].id;
    } catch (error: any) {
        console.error('Error in updateFileRecord:', error);
        throw {
            statusCode: 500,
            message: error.message
        };
    }
}

