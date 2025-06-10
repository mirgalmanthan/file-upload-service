import { Worker } from 'bullmq';
import * as dotenv from 'dotenv';

dotenv.config();

// Process the job
async function processJob(job: any) {
    console.log(`Processing job ${job.id}`);
    console.log('Job data:', job.data);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Add your actual text extraction logic here
    // For example:
    // const extractedText = await extractText(job.data.filePath);
    
    console.log(`Completed processing job ${job.id}`);
    return { success: true, message: 'Text extracted successfully' };
}

// Create a worker
const worker = new Worker('extract-text', processJob, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 5, // Process 5 jobs in parallel
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 1000 }, // Keep last 1000 failed jobs
});

// Worker events
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

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    process.exit(0);
});
