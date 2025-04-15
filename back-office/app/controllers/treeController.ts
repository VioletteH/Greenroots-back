import { Request, Response } from 'express';
import { getAllTrees, updateTree, deleteTree, addTree } from '../api/tree';
import { Tree } from '../types/index';

const treeController = {
   tree: async (req: Request, res: Response): Promise<void> => {
      try {
         const data: Tree[] = await getAllTrees();
         res.render('trees', { data });
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   },
   updateTree: async (req: Request, res: Response): Promise<void> => {
      try {
         const id = req.params.id;
         const updatedData = req.body;

         const data: Tree = await updateTree(id, updatedData);
         res.render(`trees/${id}`, { data });
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   },
   deleteTree: async (req: Request, res: Response): Promise<void> => {
      try {
          const id = req.params.id;
          await deleteTree(id);
          res.redirect('/trees');
      } catch (error) {
          console.error('Erreur lors de la suppression de l\'arbre:', error);
          res.status(500).send('Erreur interne');
      }
   },
   addTree: async (req: Request, res: Response): Promise<void> => {
      try {
         const newTree = await addTree(req.body);
         res.redirect('/trees');
      } catch (error) {
         console.error("Erreur lors de la création d'un arbre:", error);
         res.status(500).send('Erreur interne');
      }
   }
};

export default treeController;