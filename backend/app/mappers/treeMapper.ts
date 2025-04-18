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
}