import { Request, Response } from 'express';
import { getAll, getOne, getForestByTree, remove, add, update } from '../api/tree';
import { getAll as getAllForests } from '../api/forest';
import { Tree, TreeWithAssociations } from '../types/index';

import fs from 'fs';
import path from 'path';

interface ForestAssociationForm {
   [forestId: string]: {
     checked?: string;
     stock?: string;
   };
}
 
 interface TreeForm {
   name: string;
   scientific_name?: string;
   category?: string;
   description?: string;
   image?: string;
   co2?: string;
   o2?: string;
   price?: string;
   forestAssociations?: ForestAssociationForm;
}

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
         const forests = await getForestByTree(id);
         res.render('tree/show', { tree, forests });
      } catch (error) {
         console.error('Erreur dans getTree :', error);
         res.status(500).send('Erreur en interne');
      }
   },

   editTreeView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const tree = await getOne(id);
         const forestsAssigned = await getForestByTree(id);
         const allForests = await getAllForests();
         const forests = allForests.filter((forest) => {
            return !forestsAssigned.some((assignedForest) => assignedForest.id === forest.id);
         });
         res.render('tree/edit', {tree, forests, forestsAssigned});
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
   
   createTreeView: async (req:Request, res:Response) => {
      const forests = await getAllForests();
      res.render('tree/new', { forests });
   },
   createTreePost: async (req: Request, res: Response) => {
      const form = req.body as TreeForm;

      if (req.file) {
         form.image = `/uploads/trees/${req.file.filename}`;
      }

      const parsedAssociations: { forestId: number; stock: number }[] = [];

      if (form.forestAssociations && typeof form.forestAssociations === 'object') {
         for (const [forestId, assoc] of Object.entries(form.forestAssociations)) {
           if (assoc.checked) {
             const stock = parseInt(assoc.stock || '', 10);
             if (!isNaN(stock) && stock > 0) {
               parsedAssociations.push({
                 forestId: Number(forestId),
                 stock
               });
             }
           }
         }
      }

      const treeToInsert: Omit<Tree, 'id' | 'createdAt' | 'updatedAt' | 'categorySlug'> & {
         forestAssociations: { forestId: number; stock: number }[];
      } = {
         name: form.name,
         scientific_name: form.scientific_name ?? '',
         category: form.category ?? '',
         description: form.description ?? '',
         image: form.image ?? '',
         co2: Number(form.co2 ?? 0),
         o2: Number(form.o2 ?? 0),
         price: Number(form.price ?? 0),
         forestAssociations: parsedAssociations
      };

      try {
         await add(req, treeToInsert as unknown as Tree);
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