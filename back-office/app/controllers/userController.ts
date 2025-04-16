import { Request, Response } from 'express';
import { User } from '../types/index';

import { getAll, getOne, add, update, remove } from '../api/user';



const userController = {
   getAllUsers: async (req:Request, res:Response) => {
      try {
         const users: User[] = await getAll();
         res.render('user/index', { users });
      } catch (error) {
         console.error('Erreur dans getAllUsers :', error);
         res.status(500).send('Erreur interne');
      }
   },

   getUser: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const user: User = await getOne(id);
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
      const user: User = req.body;
      try {
         await add(user);
         res.redirect('/users');
      } catch (error) {
         console.error('Erreur dans createUserPost :', error);
         res.status(500).send('Erreur interne');
      }
   },

   editUserView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const user = await getOne(id);
         res.render('user/edit', {user});
      } catch (error) {
         console.error('Erreur dans editUserView :', error);
         res.status(500).send('Erreur interne');
      }
   },

   updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const user: User = req.body;
  
    const filteredUser: Partial<User> = Object.fromEntries(
      Object.entries(user).filter(([_, value]) => {
        return typeof value === 'string' ? value.trim() !== '' : true;
      })
    );
  
    console.log(filteredUser);
    try {
      await update(Number(id), filteredUser);
      res.redirect('/users');
    } catch (error) {
      console.error('Erreur dans updateUser :', error);
      res.status(500).send('Erreur interne');
    }
  },

   deleteUser: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         await remove(Number(id));
         res.redirect('/users');
      } catch (error) {
         console.error('Erreur dans deleteUser :', error);
         res.status(500).send('Erreur interne');
      }
   }      

}

export default userController;