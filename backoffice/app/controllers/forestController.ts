import { Request, Response } from 'express';
import { Forest, ForestForm } from '../types/index';

import { getAll, getOne, add, update, remove, forestWithTreesAndStock } from '../api/forest';
import { getAll as getAllTrees } from '../api/tree';

import fs from 'fs';
import path from 'path';

const forestController = {
   getAllForests: async (req:Request, res:Response): Promise<void> => {
      try {
         const limit = 9;
         const page = Number(req.query.page as string) || 1;
         const offset = (page - 1) * limit;

         const { forests, total } = await getAll(limit, offset, true);
         const totalPages = total ? Math.ceil(total / limit) : 1;

         res.render('forest/index', { 
            forests,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
          });
      } catch (error) {
         console.error('Error fetching all forests:', error);
         res.status(500).render('error/500', { error });
      }
   },

   getForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest = await forestWithTreesAndStock(id);
         if (!forest) {
            return res.status(404).render('error/404');
         }
         res.render('forest/show', { forest });
      } catch (error) {
         console.error('Error fetching forest:', error);
         res.status(500).render('error/500', { error });
      }
   },

   createForestView: async (req:Request, res:Response) => {
      try {
         const {trees} = await getAllTrees();
         console.log("Réponse de getAllTrees:", trees);
         res.render('forest/new', { trees });
      } catch (error) {
         console.error('Error fetching trees for new forest:', error);
         res.status(500).render('error/500', { error });
      }
   },

   createForestPost: async (req:Request, res:Response) => {
      const form = req.body as ForestForm;

      if (req.file) {
         form.image = `/uploads/forests/${req.file.filename}`;
      }

      // Parser les associations forêt-arbre
      const parsedAssociations: { treeId: number ; stock: number }[] = [];

      // Vérifier si form.treeAssociations est un objet
      if (form.treeAssociations && typeof form.treeAssociations === 'object') {
         // Parcourir les associations forêt-arbre
         for (const [treeId, assoc] of Object.entries(form.treeAssociations)) {
            // Vérifier si l'association est cochée
            if (assoc.checked) {
               const stock = parseInt(assoc.stock || '', 10);
               // Vérifier si le stock est un nombre valide et supérieur à 0
               if (!isNaN(stock) && stock > 0) {
                  // Ajouter l'association à la liste des associations
                  parsedAssociations.push({
                     treeId: Number(treeId),
                     stock
                  });
               }
            }
         }
      }

      // Créer la forêt avec les données du formulaire
      const forestToInsert: Omit<Forest, 'id' | 'createdAt' | 'updatedAt'> & {
         treeAssociations: { treeId: number; stock: number }[];
      } = {
         ...form,
         treeAssociations: parsedAssociations
      };
      
      try {
         await add(req, forestToInsert as unknown as Forest);
         res.redirect('/forests');
      } catch (error) {
         console.error('Error creating forest:', error);
         res.status(500).render('error/500', { error });
      }
   },

   editForestView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const treesResponse = await getAllTrees(1000);
         const trees = treesResponse.trees ?? treesResponse;
         console.log("forestController - editForestView - tree", trees);
         const forest = await forestWithTreesAndStock(id);
         console.log("forestController - editForestView - forest", forest);

         if (!forest) {
            return res.status(404).render('error/404');
         }
         res.render('forest/edit', {forest, trees});
      } catch (error) {
         console.error('Error fetching forest for edit:', error);
         res.status(500).render('error/500', { error });
      }
   },

   updateForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      const form = req.body as ForestForm;
      const oldImage = form.oldImage

      if (req.file) {
         const oldImagePath = path.join(__dirname, '../../public', oldImage);
         fs.unlink(oldImagePath, (err) => {
            if (err) {
               console.error('Erreur lors de la suppression de l\'ancienne image :', err);
            }
         });

         const imageUrl = `/uploads/forests/${req.file.filename}`;
         form.image = imageUrl;
      } else {
         form.image = oldImage;
      }

      // Parser les associations forêt-arbre
      const parsedAssociations: { treeId: number; stock: number }[] = [];

      // Vérifier si form.treeAssociations est un objet
      if (form.treeAssociations && typeof form.treeAssociations === 'object') {
         // Parcourir les associations forêt-arbre
         for (const [treeId, assoc] of Object.entries(form.treeAssociations)) {
            // Vérifier si l'association est cochée
            if (assoc.checked) {
               const stock = parseInt(assoc.stock || '', 10);
               // Vérifier si le stock est un nombre valide et supérieur à 0
               if (!isNaN(stock) && stock > 0) {
                  // Ajouter l'association à la liste des associations
                  parsedAssociations.push({
                     treeId: Number(treeId),
                     stock
                  });
               }
            }
         }
      }

      // Créer la forêt avec les données du formulaire
      const forestToUpdate: Omit<Forest, 'id' | 'createdAt' | 'updatedAt' | 'countrySlug'> & {
         treeAssociations: { treeId: number; stock: number }[];
      } = {
         name: form.name,
         association: form.association ?? '',
         country: form.country ?? '',
         description: form.description ?? '',
         image: form.image ?? '',
         location_x: Number(form.location_x ?? 0),
         location_y: Number(form.location_y ?? 0),
         treeAssociations: parsedAssociations
      };
 
      try {
         await update(req, Number(id), forestToUpdate as unknown as Forest);
         res.redirect('/forests');
      } catch (error) {
         console.error('Error updating forest:', error);
         res.status(500).render('error/500', { error });
      }
   },

   deleteForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest: Forest = await getOne(id);

         if (!forest) {
            return res.status(404).render('error/404');
         }

         if (forest.image) {
            const imagePath = path.join(__dirname, '../../public', forest.image);
            fs.unlink(imagePath, (err) => {
               if (err) {
                  console.error('Erreur lors de la suppression de l\'image :', err);
               }
            });
         }

         await remove(req, Number(id));
         res.redirect('/forests');
      } catch (error) {
         console.error('Error deleting forest:', error);
         res.status(500).render('error/500', { error });
      }
   }      

}

export default forestController;