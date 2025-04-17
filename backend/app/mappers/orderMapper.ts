import { snakeToCamel } from '../utils/toggleCase';
import BaseMapper from './baseMapper';
import { pool } from './db';
import { Order } from '../types/index';

export default class OrderMapper extends BaseMapper<any> {
    constructor() {
        super('order');
    }

    async ordersByUserId(id : number): Promise<Order[] | null> {
        const query = `
            SELECT *
            FROM "order" o
            JOIN "user" u ON o.user_id = u.user_id
            WHERE u.user_id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Order[];
    }
}