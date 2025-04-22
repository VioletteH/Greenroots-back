import { snakeToCamel } from '../utils/toggleCase';
import BaseMapper from './baseMapper';
import { pool } from './db';
import { Forest } from '../types/index';

export default class TreeMapper extends BaseMapper<any> {
    constructor() {
        super('tree');
    }

    async treeByForest(id : number): Promise<Forest[]> {
        const query = `
            SELECT DISTINCT t.*
            FROM tree t
            JOIN forest_tree ft ON ft.tree_id = t.id
            WHERE ft.forest_id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Forest[];
    }

    async treeByCountry(slug: string): Promise<Forest[]> {
        const query = `
            SELECT f.country, STRING_AGG(t.name, ', ' ORDER BY t.name) AS trees
            FROM tree t
            JOIN forest_tree ft ON t.id = ft.tree_id
            JOIN forest f ON ft.forest_id = f.id
            WHERE f.country_slug = $1
            GROUP BY f.country
        `;
        const { rows } = await pool.query(query, [slug]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Forest[];
    }

    async treeByCategory(slug: string): Promise<Forest[]> {
        console.log("slug in treeByCategory:", slug);
        const query = `
            SELECT *
            FROM tree
            WHERE category_slug = $1
        `;
        const { rows } = await pool.query(query, [slug]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Forest[];
    }

    async addTreeToForests(treeId: number, forestAssociations: { forestId: number, stock: number }[]): Promise<void> {
        const query = `
            INSERT INTO forest_tree (tree_id, forest_id, stock)
            VALUES ($1, $2, $3)
        `;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const { forestId, stock } of forestAssociations) {
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
        const insertQuery = `
            INSERT INTO forest_tree (tree_id, forest_id, stock)
            VALUES ($1, $2, $3)
            ON CONFLICT (tree_id, forest_id)
            DO UPDATE SET stock = EXCLUDED.stock
        `;
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
    
            // Étape 1 : Insert / Update
            for (const { forestId, stock } of forestAssociations) {
                await client.query(insertQuery, [treeId, forestId, stock]);
            }
    
            // Étape 2 : Suppression des associations qui ne sont plus présentes
            const forestIds = forestAssociations.map(fa => fa.forestId);
            if (forestIds.length > 0) {
                const placeholders = forestIds.map((_, i) => `$${i + 2}`).join(', ');
                const deleteQuery = `
                  DELETE FROM forest_tree
                  WHERE tree_id = $1
                  AND forest_id NOT IN (${placeholders})
                `;
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

    async getTreeWithForestsAndStock(treeId: number): Promise<any> {
        const query = `
            SELECT tree.*, 
                array_agg(forest.name ORDER BY forest.name) AS forestName,
                array_agg(forest_tree.stock ORDER BY forest.name) AS stock
            FROM tree
            JOIN forest_tree ON tree.id = forest_tree.tree_id
            JOIN forest ON forest.id = forest_tree.forest_id
            WHERE tree.id = $1
            GROUP BY tree.id, tree.name, tree.category, tree.price LIMIT 100
        `;
        const { rows } = await pool.query(query, [treeId]);
        if (!rows || rows.length === 0) return null;
        return snakeToCamel(rows[0]);
    }
}