
import { Request, Response } from 'express';
import { loginSchema } from '../utils/shemasJoi';
import AuthMapper from '../mappers/authMapper';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';



import type { User} from '../types/index';


const JWT_SECRET = process.env.JWT_SECRET as string;
const userMapper = new AuthMapper();

const authController = {   
    
    login: async (req: Request, res: Response): Promise<void>  => {
        try {
            console.log("🧪 Étape 1 - Validation Joi");
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                console.log("❌ Joi error:", error);
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const hash = await argon2.hash('test');
            console.log("🔑 Hash mot de passe :", hash);
            console.log("🧪 Étape 2 - Recherche user");
            const user = await userMapper.findByEmail(value.email) as User;
            if (!user) {
                console.log("❌ Aucun utilisateur trouvé pour :", value.email);
                res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
                return;
            }
            console.log("🧪 Étape 3 - Vérification mot de passe");
            const passwordValid = await argon2.verify(user.password, value.password);
            if (!passwordValid) {
                console.log("❌ Mot de passe invalide");
                res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
                return;
            }
            const token = jwt.sign(

                { id: user.id, role: user.role, email: user.email },
                JWT_SECRET,
                { expiresIn: '12h' }
            );
            console.log("🧪 Étape 4 - Génération du token JWT");
            res.status(200).json({
                message: 'Connexion réussie !',
                token,
                user: { id: user.id, email: user.email, role: user.role }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
            return;
        }
    },
    register: (req:Request, res:Response) => {
        res.send("Register Page");
    }
}
export default authController;