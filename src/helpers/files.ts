import { Request } from "express";
import { FileData } from "../structs/file_data";

export function getFileData(request: Request) {
    console.log("getFileData invoked");
    
    let fileData: FileData = new FileData();
    fileData.user_id = request.body.userId;
}