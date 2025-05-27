import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { catchAsync } from "../utils/catchAsync";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isGranted = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    // Get user role from token
    const token = req.headers.authorization?.split(' ')[1];
    
    // If token is not found, return unauthorized
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userRole: string = decodedToken.role;

    // If user role is not found, return forbidden
    if (!userRole) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    // If user role is admin, allow access
    if (userRole === "admin") {
        next();
        return;
    }

    // If user role is user, check if the user ID matches the token ID
    if (userRole === "user") {
        const id = parseInt(req.params.id, 10);
        const tokenId: number = decodedToken.id;
        if (id && id !== tokenId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        return next();
    }    
});