import { Request } from "express";
import { FileData, FileStatus, getFileStatus } from "../structs/file_data";

export function getFileData(request: Request) {
    console.log("getFileData invoked");
    let fileData: FileData = new FileData();
    try {
        if (!request.file) throw new Error("File not found");
        fileData.user_id = request.body.userId;
        fileData.original_filename = request.file.originalname;
        fileData.status = FileStatus.UPLOADED;
        fileData.storage_path = '/uploads/' + request.file.filename;
        fileData.title = request.body.title;
        fileData.description = request.body.description;
    } catch (error: any) {
        throw error;
    } finally {
        return fileData;
    }
}