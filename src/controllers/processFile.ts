import { Request, Response } from "express";
import { addFileRecord } from "../db/queries/files";
import { FileStatus } from "../structs/file_data";
import { ApiResponse } from "../structs/io";
import { getFileData } from "../helpers/files";

export async function processFile(req: Request, res: Response) {
    console.log("processFile invoked");
    console.log(req.files)
    let response = new ApiResponse();

    try {
        let fileData = getFileData(req);
        await addFileRecord(fileData);
        return res.status(200).json({
            message: 'uplaoded file'
        })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json('Somthing went wrong')
    }
}