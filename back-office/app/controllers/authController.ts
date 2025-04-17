import axios from "axios";
import { Request, Response } from "express";

const API_URL = "http://greenroots-backend:3000";

const authController = {
    loginView: (req: Request, res: Response) => {
        res.render('auth/login');
    },

    loginPost: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const response = await axios.post(`${API_URL}/login/`, {
                email,
                password,
            });

            const { token, user } = response.data;

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