import { Queue } from "bullmq";

const extractTextQueue = new Queue('extract-text', {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
    }
});

export default extractTextQueue;
