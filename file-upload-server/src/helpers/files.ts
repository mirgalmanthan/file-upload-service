import { Request } from "express";
import { IFileData, FileStatus, getFileStatus } from "../structs/file_data";

export function getFileData(request: Request) {
    console.log("getFileData invoked");
    let fileData: IFileData = {
        user_id: '',
        original_filename: '',
        storage_path: '',
        title: '',
        description: '',
        status: FileStatus.UPLOADED,
        extracted_data: ''
    };
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