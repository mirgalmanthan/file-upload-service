import extractTextQueue from "../queues/extract_text";

export async function assignExtractTextJob(filename: string, userId: string, jobId: string, fileId: string) {
    console.log("assignExtractTextJob invoked");
    let job = await extractTextQueue.add(filename, { userId, filePath: 'file-upload-service/' + filename, filename, jobId, fileId })
    console.log("job added: " + job.id)
    return job.id;
}