import { Request, Response } from "express";
import { addFileRecord } from "../db/queries/files";
import { FileStatus } from "../structs/file_data";
import { ApiResponse } from "../structs/io";
import { getFileData } from "../helpers/files";
import { createJob as addJobRecord } from "../db/queries/jobs";
import { JobStatus } from "../structs/job_data";
import { JobType } from "../structs/job_data";
import { assignExtractTextJob } from "../helpers/jobs";
import { saveToS3 } from "../helpers/aws";
import { deleteFile } from "../helpers/files";
import * as fs from 'fs';

export async function processFile(req: Request, res: Response) {
    console.log("processFile invoked");
    let response = new ApiResponse();
    let fileName = req.file?.filename;
    const filePath = `uploads/${fileName}`;
    try {
        // Upload file to S3
        let s3Response = await saveToS3(fs.readFileSync(filePath), 'mmsoft', 'file-upload-service', fileName || '');
        if (!s3Response.success) {
            throw new Error(`${s3Response.message}`);
        }

        // Delete the file from local storage after successful upload to S3
        await deleteFile(filePath);

        let fileData = getFileData(req);
        let fileId = await addFileRecord(fileData);
        let jobId =  await addJobRecord({
            file_id: fileId,
            job_type: JobType.EXTRACT_DATA,
            status: JobStatus.QUEUED,
            error_message: '',
            started_at: new Date()
        });
        let extractTextJobId = await assignExtractTextJob(fileName || '', req.body.userId);
        return res.status(200).json({
            message: 'Uploaded file successfully and removed from local storage',
            jobId: jobId,
            extractTextJobId: extractTextJobId
        })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json('Somthing went wrong')
    }
}