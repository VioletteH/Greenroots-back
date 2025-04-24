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
            SELECT o.*, u.firstname, u.lastname, u.email
            FROM "order" o
            JOIN "user" u ON o.user_id = u.id
            WHERE o.id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        const rowsCamel = rows.map(snakeToCamel);
        return rowsCamel[0] ?? null;        
    }
}