import pg from "pg";
import debug from "debug";
import "dotenv/config";

const { Pool } = pg;

// Création d'un espace de log dédié à la BDD
const dbDebug = debug("app:db");

// connection à la BDD
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    dbDebug("PostgreSQL is connected.");
    client.release();
  } catch (error) {
    dbDebug("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
};

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    dbDebug(`Executing query: ${text} with params ${JSON.stringify(params)}`);
    const result = await client.query(text, params);
    dbDebug(`Query success: ${result.rowCount} rows returned`);
    return result.rows;
  } catch (error) {
    dbDebug("Query error:", error);
    throw error;
  } finally {
    client.release();
  }
};