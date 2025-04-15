import { Request, Response } from 'express';
import { Forest } from '../types/index';

import { getAll } from '../api/forest';



const forestController = {
   getAllForests: async (req:Request, res:Response) => {
      try {
         const forests: Forest[] = await getAll();
         res.render('forest/index', { forests });
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   },

}

export default forestController;