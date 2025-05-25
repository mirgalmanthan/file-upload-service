import { Request, Response, Router, NextFunction } from "express";
import multer, { StorageEngine } from "multer";
import { verifyAuthToken } from "../middlewares/verify";
import fs from "fs";
import path from "path";

const filesRouter = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
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
            if (file.mimetype !== 'application/pdf') {
                return callback(new Error('File must be a PDF'));
            }
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

filesRouter.post('/upload', verifyAuthToken, handleFileUpload, (req: Request, res: Response) => {
    console.log("uploading file");
    console.log(req.file);
    res.status(200).json({ message: 'File uploaded successfully' });
});

export default filesRouter;