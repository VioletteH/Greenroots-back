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

}