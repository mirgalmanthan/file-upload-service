import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bycrpt from 'bcrypt';


export function generateAuthToken(userData: any, secret: string, expiry?: number){
    let token = expiry ?  jwt.sign(userData, secret, {
        expiresIn: `${expiry}m`
    }) : jwt.sign(userData, secret)
    return token;
}


export async function hashPassword(password: string, saltRounds: number) {
    console.log("hashPassword invoked")
    let hash = "";
    try {
        console.log(password)
        console.log(typeof(password))
    hash = await bycrpt.hash(password, saltRounds)
    } catch (err) {
        console.log('ERROR creating hash: ' + err)
    } finally {
        return hash;
    }
}

export async function comparePassword(password: string, hash: string) {
    let result = false;
    try {
        result = await bycrpt.compare(password, hash)
    } catch (err) {
        console.log('ERROR comparing hash: ' + err)
    } finally {
        return result;
    }
}