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
        FROM "order" AS o
        JOIN "user" AS u ON o.user_id = u.id
        WHERE u.id = $1
      `;

        const { rows } = await pool.query(query, [id]);
        if (!rows) return []; 
        return rows.map(snakeToCamel) as Order[];
    }

}