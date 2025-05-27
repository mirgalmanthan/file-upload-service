
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
    console.log(req.body);
    let userName = req.body.userName;
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, uploadsDir);
        },
        filename: (req, file, callback) => {
            console.log("filename invoked with user data:");
            const filename = `${Date.now()}-${userName}.pdf`;
            callback(null, filename);
        }
    });

    const upload = multer({
        storage: storage,
        fileFilter: (req, file, callback) => {
            console.log("file filter invoked");
            console.log(file)
            let validationErros = fileInputValidator(file, req.body);
            if (validationErros.length > 0) return callback(new Error(validationErros.join(", ")));
            callback(null, true);
        },
        limits: {
            fileSize: 10000000 // 10MB
        }
    }).single('file');

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ 
                error: true, 
                message: err.message 
            });
        }
        next();
    });
};