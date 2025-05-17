import { Request, Response, Router } from "express";
import { authInputValidator } from "../middlewares/validators";
import { userLogin } from "../controllers/userLogin";
import { registerUser } from "../controllers/userRegister";

const authRouter = Router();

authRouter.get('/login', async (req: Request, res: Response) => {
    await userLogin(req, res);
});

authRouter.post('/register', async (req: Request, res: Response) => {
    await registerUser(req, res)
});
export default authRouter;  