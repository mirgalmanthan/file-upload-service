import express from 'express';
import { Worker } from 'bullmq';
import * as dotenv from 'dotenv';
import { extractPDFData, fetchFileFromS3 } from './src/helpers';
import { updateFileRecord, updateFileStatus } from './src/db/queries/files';
import { FileStatus } from './src/structs/file_data';
import { updateJobStatus } from './src/db/queries/jobs';
import { JobStatus } from './src/structs/job_data';

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send({
        message: "Hello Extract Text API",
    });
});

// Process the job
async function processJob(job: any) {
    console.log(`Processing job ${job.id}`);
    console.log('Job data:', job.data);
    let filePath = job.data.filePath;
    try {
        let fetchFile = await fetchFileFromS3(filePath, 'mmsoft', job.data.filename);
        if (!fetchFile.success) {
            return { success: false, message: fetchFile.message };
        }

        let updatedFileId = await updateFileStatus(job.data.fileId, FileStatus.PROCESSING);
        let updatedJobId = await updateJobStatus(job.data.jobId, JobStatus.PROCESSING);

        console.log('------Updated File and Job ID-------', updatedFileId, updatedJobId)
        console.log(fetchFile)

        //just adding extracted data to db, ideally this is incorrect. Can Process data from this scenario and save in db.
        let extractedData = await extractPDFData(fetchFile.filePath);
        
        console.log('------Extracted Data-------', extractedData)
        let fileRecord = await updateFileRecord(job.data.fileId, FileStatus.PROCESSED, JSON.stringify(extractedData));
        let jobRecord = await updateJobStatus(job.data.jobId, JobStatus.COMPLETED);
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log(`Completed processing job ${job.id}`);
        return { success: true, message: 'Text extracted successfully' };
    } catch (error: any) {
        let updatedFileId = await updateFileStatus(job.data.fileId, FileStatus.FAILED);
        let updatedJobId = await updateJobStatus(job.data.jobId, JobStatus.FAILED);
        console.log('ERROR IN PROCESS JOB', error)
        return { success: false, message: error.message };
    }
}

const worker = new Worker('extract-text', processJob, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 5,
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 1000 }, // Keep last 1000 failed jobs
});

worker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result);
    // Here you can update your database with the result
});

worker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed with error:`, error);
    // Here you can update your database with the failure
});

worker.on('error', (error) => {
    console.error('Worker error:', error);
});

console.log('Worker started. Waiting for jobs...');

process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    process.exit(0);
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


function shutdown() {
    console.log('Received shutdown signal. Closing server...');
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Forcefully shutting down...');
        process.exit(1);
    }, 10000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown); 
