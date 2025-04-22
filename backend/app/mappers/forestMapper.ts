import { snakeToCamel } from '../utils/toggleCase';
import BaseMapper from './baseMapper';
import { pool } from './db';
import { Forest } from '../types/index';

export default class ForestMapper extends BaseMapper<any> {
    constructor() {
        super('forest');
    }

    async forestByTree(id : number): Promise<Forest[]> {
        const query = `
            SELECT DISTINCT f.*
            FROM forest f
            JOIN forest_tree ft ON ft.forest_id = f.id
            WHERE ft.tree_id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Forest[];
    }

    async getForestWithTreesAndStock(forestId: number): Promise<any> {
        const query = `
            SELECT forest.*,
                array_remove(array_agg(tree.name ORDER BY tree.name), NULL) AS treesName,
                array_remove(array_agg(forest_tree.stock ORDER BY tree.name), NULL) AS stock
            FROM forest
            LEFT JOIN forest_tree ON forest.id = forest_tree.forest_id
            LEFT JOIN tree ON forest_tree.tree_id = tree.id
            WHERE forest.id = $1
            GROUP BY forest.id
        `;
        const { rows } = await pool.query(query, [forestId]);
        if (!rows || rows.length === 0) return null;
        return snakeToCamel(rows[0]);
    }
}