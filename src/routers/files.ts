import { Request, Response, Router } from "express";
import { verifyAuthToken } from "../middlewares/verify";
import { handleFileUpload } from "../middlewares/file_upload";

const filesRouter = Router();

filesRouter.post('/upload', verifyAuthToken, handleFileUpload, (req: Request, res: Response) => {
    console.log("uploading file");
    console.log(req.file);
    console.log(req.body)
    res.status(200).json({ message: 'File uploaded successfully' });
});

export default filesRouter;