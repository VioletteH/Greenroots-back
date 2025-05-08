import { Request, Response } from 'express';
import { User } from '../types/index';
import {sanitizeObject} from "../utils/sanitize";

import { getAll, getOne, add, update, remove } from '../api/user';
import { userInfo } from 'os';

const userController = {

   getAllUsers: async (req:Request, res:Response): Promise<void> => {
      try {
         const limit = 9;
         const page = Number(req.query.page as string) || 1;
         const offset = (page - 1) * limit;

         const { users, total } = await getAll(req, limit, offset, true);
         const totalPages = total ? Math.ceil(total / limit) : 1;
         console.log("DEBUG3 users", users);
         res.render('user/index', { 
            users,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
         });
      } catch (error) {
         console.error('Error fetching all forests:', error);

         // console.error('Erreur dans getAllUsers :', error);

         // if (error instanceof Error && error.message.includes("tokenbo")) {
         //    return res.redirect("/login");
         // }

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
  
    console.log("DEBUG id", id);
    console.log("DEBUG user", user);
    const filteredUser: Partial<User> = Object.fromEntries(
      Object.entries(user).filter(([_, value]) => {
        return typeof value === 'string' ? value.trim() !== '' : true;
      })
    );
    console.log("DEBUG filteredUser", filteredUser);
    try {
      console.log(`DEBUG Updating user with id ${id} and data:`, filteredUser);
      await update(req, Number(id), filteredUser);
      console.log(`DEBUG User with id ${id} updated ok:`);
      res.redirect('/users');
    } catch (error) {
      console.error('DEBUG Erreur dans updateUser :', error);
      res.status(500).send('Erreur interne');
    }
  },     

     deleteUser: async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
           const user: User = await getOne(req, id);
  
           if (!user) {
              return res.status(404).render('error/404');
           }
           
           await remove(Number(id));
           res.redirect('/users');
        } catch (error) {
           console.error('Error deleting user:', error);
           res.status(500).render('error/500', { error });
        }
     },
}

export default userController;