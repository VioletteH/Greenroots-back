import { Request, Response } from 'express';
import { Forest } from '../types/index';



const forestController = {

   // forests: async (req:Request, res:Response) => {
   //    const forests = await forestMapper.findAll();
   //    res.json(forests);
   // },
   // addForest: async (req:Request, res:Response) => {
   //    const newForestData = req.body; 
   //    const newForest = await forestMapper.create(newForestData);
   //    res.status(201).json(newForest);
   // },
   // updateForest: async (req:Request, res:Response) => {
   //    const id = parseInt(req.params.id, 10);
   //    const updatedForestData = req.body; 
   //    const updatedForest = await forestMapper.update(id, updatedForestData);
   //    res.json(updatedForest);
   // },
   // deleteForest: async (req:Request, res:Response) => {
   //    const id = parseInt(req.params.id, 10);
   //    const deletedForest = await forestMapper.delete(id);
   //    res.send("Forêt supprimée");
   // }
}

export default forestController;