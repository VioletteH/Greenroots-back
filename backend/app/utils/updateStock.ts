import { pool } from '../mappers/db';
import { AppError } from '../middlewares/errorHandler';

export const updateStock = async (treeId: number, forestId: number, quantity: number) => {
    console.log(`updateStock called with treeId: ${treeId}, forestId: ${forestId}, quantity: ${quantity}`);
    
  try {
    const query = `
      UPDATE forest_tree
      SET stock = stock - $1
      WHERE tree_id = $2 AND forest_id = $3
    `;
    const values = [quantity, treeId, forestId];

    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new AppError('Stock not updated', 400);
    }
  } catch (error) {
    throw new AppError('Error updating stock', 500);
  }
}