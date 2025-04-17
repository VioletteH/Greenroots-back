import { Request, Response } from 'express';
import { Forest } from '../types/index';

import { getAll, getOne, add, update, remove } from '../api/forest';

import fs from 'fs';
import path from 'path';

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

      if (req.file) {
         const imageUrl = `/uploads/forests/${req.file.filename}`;
         forest.image = imageUrl;
      }
      
      try {
         await add(req, forest);
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
      const { oldImage, ...forestData } = req.body;
      const forest = forestData as Forest;
      try {
         if (req.file) {
            const oldImagePath = path.join(__dirname, '../../public', oldImage);
            fs.unlink(oldImagePath, (err) => {
               if (err) {
                  console.error('Erreur lors de la suppression de l\'ancienne image :', err);
               }
            });

            const imageUrl = `/uploads/forests/${req.file.filename}`;
            forest.image = imageUrl;
         } else {
            forest.image = oldImage;
         }

         await update(req, Number(id), forest);
         res.redirect('/forests');
      } catch (error) {
         console.error('Erreur dans updateForest :', error);
         res.status(500).send('Erreur interne');
      }
   },

   deleteForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest: Forest = await getOne(id);
         if (forest.image) {
            const imagePath = path.join(__dirname, '../../public', forest.image);
            fs.unlink(imagePath, (err) => {
               if (err) {
                  console.error('Erreur lors de la suppression de l\'image :', err);
               }
            });
         }

         await remove(req, Number(id));
         res.redirect('/forests');
      } catch (error) {
         console.error('Erreur dans deleteForest :', error);
         res.status(500).send('Erreur interne');
      }
   }      

}

export default forestController;