import { snakeToCamel } from '../utils/toggleCase';
import BaseMapper from './baseMapper';
import { pool } from './db';
import { Forest, Tree } from '../types/index';

export default class TreeMapper extends BaseMapper<any> {
    constructor() {
        super('tree');
    }

    async treeByForest(id : number): Promise<Tree[]> {
        const query = `
            SELECT DISTINCT t.*
            FROM tree t
            JOIN forest_tree ft ON ft.tree_id = t.id
            WHERE ft.forest_id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Tree[];
    }

    async treeByCountry(slug: string): Promise<Tree[]> {
        const query = `
            SELECT *
            FROM tree t
            JOIN forest_tree ft ON t.id = ft.tree_id
            JOIN forest f ON ft.forest_id = f.id
            WHERE f.country_slug = $1;
        `;
        const { rows } = await pool.query(query, [slug]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Tree[];
    }

    async treeByCategory(slug: string): Promise<Tree[]> {
        console.log("slug in treeByCategory:", slug);
        const query = `
            SELECT *
            FROM tree
            WHERE category_slug = $1
        `;
        const { rows } = await pool.query(query, [slug]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Tree[];
    }

    async getTreeWithForestsAndStock(treeId: number): Promise<any> {
        const query = `
            SELECT tree.*,
                array_remove(array_agg(forest.name ORDER BY forest.name), NULL) AS forestName,
                array_remove(array_agg(forest_tree.stock ORDER BY forest.name), NULL) AS stock
            FROM tree
            LEFT JOIN forest_tree ON tree.id = forest_tree.tree_id
            LEFT JOIN forest ON forest.id = forest_tree.forest_id
            WHERE tree.id = $1
            GROUP BY tree.id;
        `;
        const { rows } = await pool.query(query, [treeId]);
        if (!rows || rows.length === 0) return null;
        return snakeToCamel(rows[0]);
    }

    async addTreeToForests(treeId: number, forestAssociations: { forestId: number, stock: number }[]): Promise<void> {
        // S'il n'y a pas d'associations, on ne fait rien
        if (!forestAssociations || forestAssociations.length === 0) return;

        const query = `
            INSERT INTO forest_tree (tree_id, forest_id, stock)
            VALUES ($1, $2, $3)
        `;
        const client = await pool.connect();
        try {
            // On commence une transaction pour s'assurer que toutes les insertions réussissent ou échouent ensemble
            await client.query('BEGIN');
            // Parcours de chaque association de forêt pour insérer une ligne dans la table 'forest_tree' pour chaque forêt associée à l'arbre.
            for (const { forestId, stock } of forestAssociations) {
                // Exécution de la requête pour chaque paire `forestId` et `stock`.
                // L'ordre des valeurs dans le tableau [treeId, forestId, stock] correspond aux placeholders $1, $2 et $3 dans la requête SQL.
                await client.query(query, [treeId, forestId, stock]);
            }
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async updateTreeToForests(treeId: number, forestAssociations: { forestId: number, stock: number }[]): Promise<void> {
        // Requête SQL pour insérer ou mettre à jour une association arbre-forêt.
        // Si l'association existe déjà (conflit sur tree_id + forest_id), on met simplement à jour le stock.
        const insertQuery = `
            INSERT INTO forest_tree (tree_id, forest_id, stock)
            VALUES ($1, $2, $3)
            ON CONFLICT (tree_id, forest_id)
            DO UPDATE SET stock = EXCLUDED.stock
        `;
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
    
            // Insertion ou mise à jour des associations arbre-forêt
            for (const { forestId, stock } of forestAssociations) {
                await client.query(insertQuery, [treeId, forestId, stock]);
            }
    
            // Suppression des associations qui ne sont plus présentes
            const forestIds = forestAssociations.map(fa => fa.forestId);
            if (forestIds.length > 0) {
                // Génère les placeholders SQL dynamiques pour la clause IN ($2, $3, ...)
                const placeholders = forestIds.map((_, i) => `$${i + 2}`).join(', ');
                const deleteQuery = `
                  DELETE FROM forest_tree
                  WHERE tree_id = $1
                  AND forest_id NOT IN (${placeholders})
                `;
                // Supprime les associations qui n'existent plus dans la nouvelle liste.
                await client.query(deleteQuery, [treeId, ...forestIds]);
            } else {
                // Aucun forestId dans la liste → on supprime tout
                await client.query(`DELETE FROM forest_tree WHERE tree_id = $1`, [treeId]);
            }    
            await client.query('COMMIT');
        } catch (err: any) {
            await client.query('ROLLBACK');
            console.error("Erreur lors de la mise à jour des associations arbre-forêt :", err.message, err.code, err.detail);
            throw err;
        } finally {
            client.release();
        }
    }

    async treeByPrice(): Promise<Tree[]> {
        const query = `
            SELECT *
            FROM tree
            ORDER BY price
        `;
        const { rows } = await pool.query(query);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Tree[];
    }

    async getAllTreesWithForests(limit?:number, offset?:number): Promise<any> {
        const query = `
            SELECT 
                t.*,
                json_agg(
                    json_build_object(
                        'id', f.id,
                        'name', f.name,
                        'stock', ft.stock
                    )
                ) AS forests
            FROM tree t
            LEFT JOIN forest_tree ft ON t.id = ft.tree_id
            LEFT JOIN forest f ON ft.forest_id = f.id
            GROUP BY t.id
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await pool.query(query, [limit, offset]);
        if (!rows || rows.length === 0) {
            return null;
        }
        return snakeToCamel(rows);
    }

    async getOneTreeWithForests(id: number): Promise<any> {
        const query = `
            SELECT 
                t.*,
                json_agg(
                    json_build_object(
                        'id', f.id,
                        'name', f.name,
                        'stock', ft.stock
                    )
                ) AS forests
            FROM tree t
            LEFT JOIN forest_tree ft ON t.id = ft.tree_id
            LEFT JOIN forest f ON ft.forest_id = f.id
            WHERE t.id = $1
            GROUP BY t.id            
        `;
        const { rows } = await pool.query(query, [id]);
        if (!rows || rows.length === 0) {
            return null;
        }
        return snakeToCamel(rows);
    }

    async getCustomTreeWithForests(ids: number[]): Promise<any> {
        const query = `
            SELECT 
                t.*,
                json_agg(
                    json_build_object(
                        'id', f.id,
                        'name', f.name,
                        'stock', ft.stock
                    )
                ) AS forests
            FROM tree t
            LEFT JOIN forest_tree ft ON t.id = ft.tree_id
            LEFT JOIN forest f ON ft.forest_id = f.id
            WHERE t.id = ANY($1)
            GROUP BY t.id 
            ORDER BY created_at DESC
        `;
        const { rows } = await pool.query(query, [ids]);
        if (!rows || rows.length === 0) {
            return null;
        }
        return snakeToCamel(rows);  
    }
}