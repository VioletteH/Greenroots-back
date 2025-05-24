import { Request, Response } from 'express';
import { getAll, getOne, treeWithforestsAndStock, remove, add, update } from '../api/tree';
import { getAll as getAllForests } from '../api/forest';
import { Tree, TreeForm } from '../types/index';

import fs from 'fs';
import path from 'path';

const treeController = {
   getAllTrees: async (req: Request, res: Response): Promise<void> => {
      try {
         const limit = 9;
         const page = Number(req.query.page as string) || 1;
         const offset = (page - 1) * limit;

         const { trees, total } = await getAll(limit, offset, true);
         const totalPages = total ? Math.ceil(total / limit) : 1;

         res.render('tree/index', {
            trees,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
         });
      } catch (error) {
         console.error('Error fetching all trees:', error);
         res.status(500).render('error/500', { error });
      }
   },

   getTree: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const tree = await treeWithforestsAndStock(id);
         // const tree = treeArray[0]; // Si on suppose que tu reçois un tableau
         if (!tree) {
            return res.status(404).render('error/404');
         }
         console.log("BO - TC - getTree", tree)
         res.render('tree/show', { tree });
      } catch (error) {
         console.error('Error fetching tree:', error);
         res.status(500).render('error/500', { error });
      }
   },

   createTreeView: async (req:Request, res:Response) => {
      try {         
         const {forests} = await getAllForests();
         res.render('tree/new', { forests });
      } catch (error) {
         console.error('Error fetching forests for new tree:', error);
         res.status(500).render('error/500', { error });
      }
   },
   createTreePost: async (req: Request, res: Response) => {
      const form = req.body as TreeForm;

      if (req.file) {
         form.image = `/uploads/trees/${req.file.filename}`;
      }

      // Parser les associations forêt-arbre
      const parsedAssociations: { forestId: number ; stock: number }[] = [];

      // Vérifier si form.forestAssociations est un objet
      if (form.forestAssociations && typeof form.forestAssociations === 'object') {
         // Parcourir les associations forêt-arbre
         for (const [forestId, assoc] of Object.entries(form.forestAssociations)) {
            // Vérifier si l'association est cochée
            if (assoc.checked) {
               const stock = parseInt(assoc.stock || '', 10);
               // Vérifier si le stock est un nombre valide et supérieur à 0
               if (!isNaN(stock) && stock > 0) {
               // Ajouter l'association à la liste des associations
                  parsedAssociations.push({
                  forestId: Number(forestId),
                  stock
                  });
               }
            }
         }
      }

      // Créer l'objet arbre à insérer
      const treeToInsert: Omit<Tree, 'id' | 'createdAt' | 'updatedAt' | 'categorySlug'> & {
         forestAssociations: { forestId: number; stock: number }[];
      } = {
         ...form,
         forestAssociations: parsedAssociations
      };

      try {
         await add(req, treeToInsert as unknown as Tree);
         res.redirect('/trees');
      } catch (error) {
         console.error('Error creating tree:', error);
         res.status(500).render('error/500', { error });
      }
   },

   editTreeView: async (req:Request, res:Response) => {
      const id = req.params.id;
      console.log("treeController - editTreeView - Tree id", id)
      try {
         const forestsResponse = await getAllForests(1000);
         const forests = forestsResponse.forests ?? forestsResponse;
         const tree = await treeWithforestsAndStock(id);

         // const forests = await getAllForests();
         // const treeArray = await treeWithForests(id);
         // const tree = treeArray[0];
         console.log("treeController - editTreeView - forest", forests);
         console.log("treeController - editTreeView - tree", tree);
         if (!tree) {
            return res.status(404).render('error/404');
         }
         res.render('tree/edit', { tree, forests });
      } catch (error) {
         console.error('Error fetching tree for edit:', error);
         res.status(500).render('error/500', { error });
      }
   },

   updateTree: async (req: Request, res: Response) => {
      const id = req.params.id;
      const form = req.body as TreeForm;
      const oldImage = form.oldImage;

      if (req.file) {
         const oldImagePath = path.join(__dirname, '../../public', oldImage);
         fs.unlink(oldImagePath, (err) => {
            if (err) {
               console.error('Erreur lors de la suppression de l\'ancienne image :', err);
            }
         });

         const imageUrl = `/uploads/trees/${req.file.filename}`;
         form.image = imageUrl;
      } else {
         form.image = oldImage;
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

      const treeToUpdate: Omit<Tree, 'id' | 'createdAt' | 'updatedAt' | 'categorySlug'> & {
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
         await update(req, Number(id), treeToUpdate as unknown as Tree);
         res.redirect('/trees');
      } catch (error) {
         console.error('Error updating tree:', error);
         res.status(500).render('error/500', { error });
      }
   },

   deleteTree: async (req: Request, res: Response) => {
      const id = req.params.id;
      try {
         const tree: Tree = await getOne(id);

         if (!tree) {
            return res.status(404).render('error/404');
         }
         
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
         console.error('Error deleting tree:', error);
         res.status(500).render('error/500', { error });
      }
   },
};

export default treeController;