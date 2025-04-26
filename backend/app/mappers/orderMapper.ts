import { snakeToCamel } from '../utils/toggleCase';
import BaseMapper from './baseMapper';
import { pool } from './db';

export default class OrderMapper extends BaseMapper<any> {
    constructor() {
        super('order');
    }

    async findAllWithCountWithUser(limit?: number, offset?: number): Promise<{ data: any[]; total: number }> {
        const queryData = `
            SELECT o.*, u.firstname, u.lastname, u.email
            FROM "order" o
            JOIN "user" u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const queryCount = `SELECT COUNT(*) FROM "order"`;

        const [dataResult, countResult] = await Promise.all([
            pool.query(queryData, [limit, offset]),
            pool.query(queryCount)
        ]);

        const data = dataResult.rows.map(snakeToCamel);
        const total = parseInt(countResult.rows[0].count, 10);

        return { data, total };
    }

    async findByIdWithUser(id: number): Promise<any | null> {
        const query = `
            SELECT 
                o.id AS order_id,
                o.total_price,
                o.status,
                o.created_at,
                o.updated_at,
                u.firstname,
                u.lastname,
                u.email,
                oi.name AS item_name,
                oi.price AS item_price,
                oi.quantity AS item_quantity
            FROM "order" o
            JOIN "user" u ON o.user_id = u.id
            JOIN "order_item" oi ON o.id = oi.order_id
            WHERE o.id = $1
        `;
        
        const { rows } = await pool.query(query, [id]);
    
        if (rows.length === 0) return null;
    
        const first = snakeToCamel(rows[0]);
    
        const order = {
            id: first.orderId,
            totalPrice: first.totalPrice,
            status: first.status,
            createdAt: first.createdAt,
            updatedAt: first.updatedAt,
            user: {
                firstname: first.firstname,
                lastname: first.lastname,
                email: first.email
            },
            items: rows.map(row => ({
                name: row.oi_name || row.item_name,
                price: row.oi_price || row.item_price,
                quantity: row.oi_quantity || row.item_quantity
            }))
        };
    
        return order;
    }
}