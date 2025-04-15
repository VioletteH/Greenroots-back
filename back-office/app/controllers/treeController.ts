import { Request, Response } from 'express';
import { getAllTrees } from '../api/tree';
import { Tree } from '../types/index';

const treeController = {
   trees: async (req: Request, res: Response): Promise<void> => {
      try {
         const data: Tree[] = await getAllTrees();
         res.render('trees', { data });
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   }
};

export default treeController;