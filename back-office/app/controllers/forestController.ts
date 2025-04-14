import { Request, Response } from 'express';

const treeController = {
   trees: (req:Request, res:Response) => {

   res.render("trees");
   }
}

export default treeController;