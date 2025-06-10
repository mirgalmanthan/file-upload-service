import extractTextQueue from "../queues/extract_text";

export async function assignExtractTextJob(filename: string, userId: string) {
    console.log("assignExtractTextJob invoked");
    let job = await extractTextQueue.add(filename, { userId })
    console.log("job added: " + job.id)
    return job.id;
}