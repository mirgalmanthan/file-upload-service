
import fs from "fs";
import path from "path";
import multer from "multer";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { fileInputValidator } from "./validators";


const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
    console.log("handleFileUpload invoked");
    // Store the existing body to restore it after multer is done
    const existingBody = { ...req.body };
    let userName = existingBody.userName;
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, uploadsDir);
        },
        filename: (req, file, callback) => {
            console.log("filename invoked with user data:");
            const fileExt = path.extname(file.originalname) || '.pdf';
            const filename = `${Date.now()}-${userName}${fileExt}`;
            callback(null, filename);
        }
    });

    const upload = multer({
        storage: storage,
        fileFilter: (req, file, callback) => {
            console.log("file filter invoked");
            console.log('File info:', {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });
            let validationErros = fileInputValidator(file, req.body);
            if (validationErros.length > 0) {
                console.log('Validation errors:', validationErros);
                return callback(new Error(validationErros.join(", ")));
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10000000 // 10MB
        }
    }).single('file');

    // Parse the form data
    upload(req as any, res as any, (err: any) => {
        if (err) {
            return res.status(400).json({ 
                error: true, 
                message: err.message 
            });
        }
        // Restore the existing body and merge with multer's body
        req.body = { ...existingBody, ...req.body };
        next();
    });
};