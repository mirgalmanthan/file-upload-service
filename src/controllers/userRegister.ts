import { Request, Response } from "express";
import { authInputValidator } from "../middlewares/validators";
import { ApiResponse } from "../structs/io";
import { createUser, getUser } from "../db/queries/user";
import { hashPassword } from "../helpers/auth";

export async function registerUser(req: Request, res: Response) {
    console.log("registerUser invoked");
    let body = req.body;
    let response = new ApiResponse();
    let validationErros = authInputValidator(body)
    try {
        if (validationErros.length > 0) {
            throw {
                statusCode: 400,
                errors: validationErros
            }
        } else {
            let user = await getUser(body.userName)
            console.log(user)
            if (user) {
                throw {
                    statusCode: 409,
                    errors: ["User already exists"]
                }
            } else {
                let password = await hashPassword(body.password, 12)
                console.log(password)
                console.log(typeof(password))
                await createUser(body.userName, password);
                response.statusCode = 200
                response.payload = {
                    message: 'User registered successfully'
                }
            }
        }
    } catch (error: any) {
        response.statusCode = error.statusCode
        response.errors = error.errors
    } finally {
        res.status(response.statusCode).json(response)
    }
}