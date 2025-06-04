import { Request, Response, Router } from "express";
import { verifyAuthToken } from "../middlewares/verify";
import { handleFileUpload } from "../middlewares/file_upload";
import { addFileRecord } from "../db/queries/files";
import { processFile } from "../controllers/processFile";

const filesRouter = Router();

filesRouter.post('/upload', verifyAuthToken, handleFileUpload, async (req: Request, res: Response) => {
    await processFile(req, res);
});

export default filesRouter;