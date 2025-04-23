import { Request, Response } from 'express';
import { Forest, ForestForm } from '../types/index';
import {sanitizeObject} from "../utils/sanitize";

import { getAll, getOne, add, update, remove, getForestWithTreesAndStock } from '../api/forest';
import { getAll as getAllTrees } from '../api/tree';

import fs from 'fs';
import path from 'path';

const forestController = {
   getAllForests: async (req:Request, res:Response) => {
      try {
         const forests: Forest[] = await getAll();
         res.render('forest/index', { forests, csrfToken: req.csrfToken() });
      } catch (error) {
         console.error('Erreur dans getAllForests :', error);
         res.status(500).send('Erreur interne');
      }
   },

   getForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest = await getForestWithTreesAndStock(id);
         res.render('forest/show', { forest });
      } catch (error) {
         console.error('Erreur dans getForest :', error);
         res.status(500).send('Erreur en interne');
      }
   },

   createForestView: async (req:Request, res:Response) => {
      const trees = await getAllTrees();
      res.render('forest/new', { trees, csrfToken: req.csrfToken() });
   },
   createForestPost: async (req:Request, res:Response) => {
      const form = sanitizeObject(req.body) as ForestForm;

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
         console.error('Erreur dans createForestPost :', error);
         res.status(500).send('Erreur interne');
      }
   },

   editForestView: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const trees = await getAllTrees();
         const forest = await getForestWithTreesAndStock(id);
         res.render('forest/edit', {forest, trees, csrfToken: req.csrfToken()});
      } catch (error) {
         console.error('Erreur dans editForestView :', error);
         res.status(500).send('Erreur interne');
      }
   },

   updateForest: async (req:Request, res:Response) => {
      const id = req.params.id;

      const form = sanitizeObject(req.body) as ForestForm;
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
         console.error('Erreur dans updateForest :', error);
         res.status(500).send('Erreur interne');
      }
   },

   deleteForest: async (req:Request, res:Response) => {
      const id = req.params.id;
      try {
         const forest: Forest = await getOne(id);
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
         console.error('Erreur dans deleteForest :', error);
         res.status(500).send('Erreur interne');
      }
   }      

}

export default forestController;