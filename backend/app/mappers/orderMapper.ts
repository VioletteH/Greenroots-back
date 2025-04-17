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
            FROM "order" 
            JOIN "user" ON user_id = order.id
            WHERE user.id = $1
        `;

        const { rows } = await pool.query(query, [id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Order[];
    }
}