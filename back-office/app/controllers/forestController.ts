import { Request, Response } from 'express';
import { Forest } from '../types/index';

import { getAll } from '../api/forest';



const forestController = {
   getAllForests: async (req:Request, res:Response) => {
      try {
         const data: Forest[] = await getAll();
         res.render('forests', { data });
      } catch (error) {
         console.error('Erreur dans le contrôleur:', error);
         res.status(500).send('Erreur interne');
      }
   },

}

export default forestController;