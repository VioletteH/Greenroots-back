import { Request, Response } from 'express';
import { getAll, getOne, remove, add, update } from '../api/tree';
import { Tree } from '../types/index';

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
      const tree: Tree = req.body;
      try {
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
          await remove(req, Number(id));
          res.redirect('/trees');
      } catch (error) {
          console.error('Erreur lors de la suppression de l\'arbre:', error);
          res.status(500).send('Erreur interne');
      }
   },
};

export default treeController;