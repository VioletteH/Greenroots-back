import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { catchAsync } from "../utils/catchAsync";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isGranted = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get user role from token
    const token = (req.headers as { authorization?: string }).authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userRole: string = decodedToken.role;

    if (!userRole) {
        return res.status(403).json({ message: "Forbidden" });
    }

    if (userRole === "admin") {
        next();
        return;
    }

    if (userRole === "user") {
        const id = parseInt(req.params.id, 10);
        const tokenId: number = decodedToken.id;
        if (id && id !== tokenId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return next();
    }    
});