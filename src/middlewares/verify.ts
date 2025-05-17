import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function verifyAuthToken(request: Request, response: Response, next: NextFunction) {
    console.log("verify token invoked");
    let token = request.headers.authorization?.replace("Bearer", "").trim() || ""
    console.log("token:"+token)
    try {
        let payload = jwt.verify(token,  process.env.JWT_USER_ACCESS_TOKEN_SECRET|| "")
        console.log("payload")
        console.log(payload)
        request.body.userId = typeof payload !="string" ? payload.userId : ""
        if(payload && typeof(payload != "string")) {
            console.log("payload found")
            next()
            return
        } else return response.status(403);
    } catch(e) {
        return response.status(403).json({
            "error": true,
            "error_payload": {
                "message": "Invalid token"
            }
        })
    }
}