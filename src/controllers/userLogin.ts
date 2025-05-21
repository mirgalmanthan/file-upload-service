import { Request, Response } from "express";
import { authInputValidator } from "../middlewares/validators";
import { ApiResponse } from "../structs/io";
import { getUser } from "../db/queries/user";
import { comparePassword, generateAuthToken } from "../helpers/auth";
import * as dotenv from 'dotenv';
dotenv.config();


export async function userLogin(req: Request, res: Response) {
    console.log("userLogin invoked");
    let body = req.body;
    let response = new ApiResponse();
    let validationErros = authInputValidator(body);
    try {
        if (validationErros.length > 0) {
            throw {
                erros: validationErros,
                statusCode: 400
            }
        } else {
            let user = await getUser(body.userName);
            if (!user) {
                throw {
                    erros: ['User not found'],
                    statusCode: 404
                }
            } else {
                let password = body.password;
                let isMatched = await comparePassword(password, user.password)
                if (!isMatched) {
                    throw {
                        erros: ['Invalid credentials'],
                        statusCode: 401
                    }
                } else {
                    let token = generateAuthToken(user, process.env.JWT_SECRET || '', parseInt(process.env.JWT_EXPIRY_MIN || "2"))
                    response.statusCode = 200;
                    response.payload = {
                        token: token
                    }
                }
            }
        }
    } catch (error: any) {
        response.errors = error.erros;
        response.statusCode = error.statusCode;
    } finally {
        return res.status(response.statusCode).json(response);
    }

}