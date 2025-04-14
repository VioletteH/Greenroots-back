import { Request, Response } from 'express';
import BaseMapper from '../mappers/baseMapper';
import { Forest } from '../types/index';


const forestMapper = new BaseMapper<Forest>('forest');

const forestController = {

   forests: async (req:Request, res:Response) => {
      const forests = await forestMapper.findAll();
      res.json(forests);
  },
   trees: (req:Request, res:Response) => {

   res.render("trees");
   }
}

export default forestController;