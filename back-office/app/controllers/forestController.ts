import { Request, Response } from 'express';
import { Forest } from '../types/index';

import { getAll, getOne, add, update, remove } from '../api/forest';



const forestController = {
   getAllForests: async (req:Request, res:Response) => {
      try {
         const forests: Forest[] = await getAll();
         res.render('forest/index', { forests });
      } catch (error) {
         console.error('Erreur dans getAllForests :', error);
         res.status(500).send('Erreur interne');
      }
   },

   getForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest: Forest = await getOne(id);
         res.render('forest/show', { forest });
      } catch (error) {
         console.error('Erreur dans getForest :', error);
         res.status(500).send('Erreur en interne');
      }
   },

   createForestView: (req:Request, res:Response) => {
      res.render('forest/new');
   },
   createForestPost: async (req:Request, res:Response) => {
      const forest: Forest = req.body;
      try {
         await add(forest);
         res.redirect('/forests');
      } catch (error) {
         console.error('Erreur dans createForestPost :', error);
         res.status(500).send('Erreur interne');
      }
   },

   editForestView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest = await getOne(id);
         res.render('forest/edit', {forest});
      } catch (error) {
         console.error('Erreur dans editForestView :', error);
         res.status(500).send('Erreur interne');
      }
   },

   updateForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      const forest: Forest = req.body;
      console.log(forest)
      try {
         await update(Number(id), forest);
         res.redirect('/forests');
      } catch (error) {
         console.error('Erreur dans updateForest :', error);
         res.status(500).send('Erreur interne');
      }
   },

   deleteForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         await remove(Number(id));
         res.redirect('/forests');
      } catch (error) {
         console.error('Erreur dans deleteForest :', error);
         res.status(500).send('Erreur interne');
      }
   }      

}

export default forestController;