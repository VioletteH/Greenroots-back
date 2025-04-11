import { snakeToCamel } from './utils/toggleCase';
import BaseMapper from './baseMapper';
import { pool } from './db';
import { Forest } from '../types/index';

export default class ForestMapper extends BaseMapper<any> {
    constructor() {
        super('forest');
    }

    async forestByTree(tree_id : number): Promise<Forest[]> {
        const query = `
            SELECT *
            FROM forest f
            JOIN forest_tree ft ON ft.forest_id = f.forest_id
            WHERE ft.tree_id = $1
        `;
        const { rows } = await pool.query(query, [tree_id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Forest[];
    }


}