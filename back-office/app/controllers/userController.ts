import { Request, Response } from 'express';
import { User } from '../types/index';
import {sanitizeObject} from "../utils/sanitize";

import { getAll, getOne, add, update } from '../api/user';

const userController = {
   getAllUsers: async (req:Request, res:Response) => {
      try {
         const users: User[] = await getAll(req);
         res.render('user/index', { users });
      } catch (error) {
         console.error('Erreur dans getAllUsers :', error);

         if (error instanceof Error && error.message.includes("token")) {
            return res.redirect("/login");
         }

         res.status(500).send('Erreur interne');
      }
   },

   getUser: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const user: User = await getOne(req, id);
         res.render('user/show', { user });
      } catch (error) {
         console.error('Erreur dans getUser :', error);
         res.status(500).send('Erreur en interne');
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
         res.status(500).send('Erreur interne');
      }
   },

   editUserView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const user = await getOne(req, id);
         res.render('user/edit', {user});
      } catch (error) {
         console.error('Erreur dans editUserView :', error);
         res.status(500).send('Erreur interne');
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