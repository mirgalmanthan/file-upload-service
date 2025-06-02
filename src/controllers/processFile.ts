import { Request, Response } from "express";
import { addFileRecord } from "../db/queries/files";
import { FileStatus } from "../structs/file_data";
import { ApiResponse } from "../structs/io";

export async function processFile(req: Request, res: Response) {
    console.log("processFile invoked");
    console.log(req.file)
    let response = new ApiResponse();
    try {
    await addFileRecord({
        user_id: "b995ae29-569f-432e-8b6f-013fb194d752",
        description: "just a test command",
        extracted_data: "Nithing",
        original_filename: "file.json",
        status: FileStatus.UPLOADED,
        storage_path: "/uploads/file.json",
        title: "Hello World File"
    });
    return res.status(200).json({
        message: 'uplaoded file'
    })
} catch (error: any) {
    console.log(error)
    return res.status(500).json('Somthing went wrong')
}
}