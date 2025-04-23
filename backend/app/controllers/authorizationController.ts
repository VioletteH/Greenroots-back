import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from "../utils/catchAsync";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Check if token exists
const authorizationController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("req.headers back:", req.headers);

    console.log("req.headers.authorization back:", req.headers.authorization); // Bearer token
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Token back:", token); // token
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    console.log("DecodedToken.role back:", decodedToken.role); // admin

    if (!decodedToken.role) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    next();
});

export default authorizationController;