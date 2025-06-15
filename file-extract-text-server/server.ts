import express from 'express';
import { Worker } from 'bullmq';
import * as dotenv from 'dotenv';

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
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log(`Completed processing job ${job.id}`);
    return { success: true, message: 'Text extracted successfully' };
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
