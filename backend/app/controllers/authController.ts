
import { Request, Response } from 'express';

const authController = {   
    login: (req:Request, res:Response) => {
        res.send("Login Page");
    },
    register: (req:Request, res:Response) => {
        res.send("Register Page");
    }
}
export default authController;