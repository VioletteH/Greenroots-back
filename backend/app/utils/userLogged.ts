import { Request } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET as string;

export const userLogged = (req: Request) => {
    // Get user id from params
    const id = parseInt(req.params.id, 10);

    // Get user id from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return null;
    }
    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const tokenId: number = decodedToken.id;

    // Compare the two IDs
    if (id !== tokenId) {
        return null;
    }

    return tokenId;
}