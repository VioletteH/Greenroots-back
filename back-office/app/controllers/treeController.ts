import { Request, Response } from 'express';
import { getAllTrees, updateTree } from '../api/tree';
import { Tree } from '../types/index';

const treeController = {
   tree: async (req: Request, res: Response): Promise<void> => {
      try {
         const data: Tree[] = await getAllTrees();
         console.log('Coucou controlleur');
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
   }
};

export default treeController;