import { Request, Response } from 'express';
import { User } from '../types/index';
import {sanitizeObject} from "../utils/sanitize";

import { getAll, getOne, add, update } from '../api/user';

const userController = {
   getAllUsers: async (req:Request, res:Response) => {
      try {
         const limit = 9;
         const page = Number(req.query.page as string) || 1;
         const offset = (page - 1) * limit;

         const { users, total } = await getAll(req, limit, offset);
         const totalPages = Math.ceil(total / limit);

         res.render('user/index', { 
            users,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
         });
      } catch (error) {
         console.error('Erreur dans getAllUsers :', error);

         if (error instanceof Error && error.message.includes("tokenbo")) {
            return res.redirect("/login");
         }

         res.status(500).render('error/500', { error });
      }
   },

   getUser: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const user: User = await getOne(req, id);
         if (!user) {
            return res.status(404).render('error/404', { message: 'Utilisateur non trouvé' });
         }
         res.render('user/show', { user });
      } catch (error) {
         console.error('Error fetching user:', error);
         res.status(500).render('error/500', { error });
      }
   },

   createUserView: (req:Request, res:Response) => {
      res.render('user/new');
   },

   createUserPost: async (req:Request, res:Response) => {
      const user: User = sanitizeObject(req.body);
      try {
         await add(req, user);
         res.redirect('/users');
      } catch (error) {
         console.error('Erreur dans createUserPost :', error);
         res.status(500).render('error/500', { error });
      }
   },

   editUserView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const user = await getOne(req, id);
         if (!user) {
            return res.status(404).render('error/404', { message: 'Utilisateur non trouvé' });
         }
         res.render('user/edit', {user});
      } catch (error) {
         console.error('Error fetching user for edit:', error);
         res.status(500).render('error/500', { error });
      }
   },

   updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const user: User = sanitizeObject(req.body);
  
    const filteredUser: Partial<User> = Object.fromEntries(
      Object.entries(user).filter(([_, value]) => {
        return typeof value === 'string' ? value.trim() !== '' : true;
      })
    );
  
    try {
      await update(req, Number(id), filteredUser);
      res.redirect('/users');
    } catch (error) {
      console.error('Erreur dans updateUser :', error);
      res.status(500).send('Erreur interne');
    }
  },     

}

export default userController;