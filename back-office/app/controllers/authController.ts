import axios from "axios";
import { Request, Response } from "express";
import {sanitizeObject} from "../utils/sanitize";

const API_URL = "http://greenroots-backend:3000";

const authController = {
    loginView: (req: Request, res: Response) => {
        res.render('auth/login', {
            csrfToken: req.csrfToken()
        });
    },

    loginPost: async (req: Request, res: Response) => {
        const sanitizedBody = sanitizeObject(req.body);
        const { email, password } = sanitizedBody;
        try {
            const response = await axios.post(`${API_URL}/login/`, {
                email,
                password,
            });

            const { token, user } = response.data;

            if (user.role !== 'admin') {
                return res.status(403).render('auth/login', {
                    email,
                    error: 'Accès réservé aux administrateurs.',
                });
            }

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            });

            res.cookie('user', JSON.stringify(user), {
                httpOnly: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            });

            return res.redirect('/');
        } catch (error: any) {
            console.error('Login error:', error);
            return res.status(500).render('auth/login', {
                email,
                error: 'An error occurred during login. Please try again later.',
            });
        }
    },

    logout: (req: Request, res: Response) => {
        res.clearCookie('token');
        res.clearCookie('user');
        return res.redirect('/login');
    }
};

export default authController;