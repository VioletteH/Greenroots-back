import { pool } from "./db";
import debug from "debug";
import {camelToSnake, snakeToCamel} from "../utils/toggleCase";

const debugBaseMapper = debug('baseMapper');

export default class BaseMapper <T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async findAll(limit?:number, offset?:number) : Promise<T[]> {
        const query = `SELECT * FROM "${this.tableName}" ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        const values = [limit, offset];
        const { rows } = await pool.query(query, values);
        const rowsCamel = rows.map(snakeToCamel)as T[];
        debugBaseMapper('findAll');
        console.log("find",rowsCamel);
        return rowsCamel;
    }

    async findById(id: number): Promise<T | null> {
        const { rows } = await pool.query(`SELECT * FROM "${this.tableName}" WHERE id = $1`, [id]);
        debugBaseMapper('findById');
        const rowsCamel = rows.map(snakeToCamel) as T[];
        return rowsCamel[0] ?? null;
    }

    async create(data: Record<string, any>): Promise<T> {
        const dataSnake = camelToSnake(data);
        const columns = Object.keys(dataSnake).join(', ');
        const values = Object.values(dataSnake);
        const params = Object.keys(dataSnake).map((_, i) => `$${i + 1}`).join(', ');
        const { rows } = await pool.query(`INSERT INTO "${this.tableName}" (${columns}) VALUES (${params}) RETURNING *`, values);
        debugBaseMapper('create');
        return rows[0];
    }

    async delete (id: number): Promise<T> {
        const { rows } = await pool.query(`DELETE FROM "${this.tableName}" WHERE id = $1 RETURNING *`, [id]);
        debugBaseMapper('delete');
        return rows[0];
    }

    async update (id: number, data: Record<string, any>): Promise<T> {
        const dataSnake = camelToSnake(data);
        const columns = Object.keys(dataSnake).map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = Object.values(dataSnake);
        const { rows } = await pool.query(`UPDATE "${this.tableName}" SET ${columns} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
        debugBaseMapper('update');
        return rows[0];
    }
    async findByField(field: string, value: any): Promise<T[]> {
        const { rows } = await pool.query(`SELECT * FROM "${this.tableName}" WHERE ${field} = $1`, [value]);
        const rowsCamel = rows.map(snakeToCamel) as T[];
        debugBaseMapper('findByField');
        return rowsCamel;
    }

}