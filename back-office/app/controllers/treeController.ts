import { Request, Response } from 'express';
import { getAll, getOne, remove, add, update } from '../api/tree';
import { Tree } from '../types/index';

import fs from 'fs';
import path from 'path';

const treeController = {
   getAllTrees: async (req: Request, res: Response): Promise<void> => {
      try {
         const trees: Tree[] = await getAll();
         res.render('tree', { trees });
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   },

   getTree: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const tree: Tree = await getOne(id);
         res.render('tree/show', { tree });
      } catch (error) {
         console.error('Erreur dans getTree :', error);
         res.status(500).send('Erreur en interne');
      }
   },

   editTreeView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const tree = await getOne(id);
         res.render('tree/edit', {tree});
      } catch (error) {
         console.error('Erreur dans editTreeView :', error);
         res.status(500).send('Erreur interne');
      }
   },

   updateTree: async (req: Request, res: Response) => {
      const id = req.params.id;
      const { oldImage, ...treeData } = req.body;
      const tree = treeData as Tree;
      try {
         if (req.file) {
            const oldImagePath = path.join(__dirname, '../../public', oldImage);
            fs.unlink(oldImagePath, (err) => {
               if (err) {
                  console.error('Erreur lors de la suppression de l\'ancienne image :', err);
               }
            });

            const imageUrl = `/uploads/trees/${req.file.filename}`;
            tree.image = imageUrl;
         } else {
            tree.image = oldImage;
         }

         await update(req, Number(id), tree)
         res.redirect('/trees');
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   },
   
   createTreeView: (req:Request, res:Response) => {
      res.render('tree/new');
   },
   createTreePost: async (req: Request, res: Response) => {
      const tree: Tree = req.body

      if (req.file) {
         const imageUrl = `/uploads/trees/${req.file.filename}`;
         tree.image = imageUrl;
      }

      try {
         await add(req, tree);
         res.redirect('/trees');
      } catch (error) {
         console.error("Erreur lors de la création d'un arbre:", error);
         res.status(500).send('Erreur interne');
      }
   },

   deleteTree: async (req: Request, res: Response) => {
      const id = req.params.id;
      try {
         const tree: Tree = await getOne(id);
         if (tree.image) {
            const imagePath = path.join(__dirname, '../../public', tree.image);
            fs.unlink(imagePath, (err) => {
               if (err) {
                  console.error('Erreur lors de la suppression de l\'image :', err);
               }
            });
         }
         
         await remove(req, Number(id));
         res.redirect('/trees');
      } catch (error) {
          console.error('Erreur lors de la suppression de l\'arbre:', error);
          res.status(500).send('Erreur interne');
      }
   },
};

export default treeController;