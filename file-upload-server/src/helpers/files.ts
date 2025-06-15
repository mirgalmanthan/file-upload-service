import { Request } from "express";
import * as fs from 'fs';
import { promisify } from 'util';
import { IFileData, FileStatus, getFileStatus } from "../structs/file_data";

const unlinkAsync = promisify(fs.unlink);

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

/**
 * Deletes a file from the local filesystem
 * @param filePath Path to the file to delete
 * @returns Promise that resolves when the file is deleted or rejects with an error
 */
export async function deleteFile(filePath: string): Promise<void> {
    try {
        await unlinkAsync(filePath);
        console.log(`Successfully deleted ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        throw error;
    }
}