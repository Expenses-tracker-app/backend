import { query } from './db.js';

const getItems = async (table) => {
  return await query(`SELECT * FROM ${table}`);
};

const getItemById = async (table, idName, id) => {
  return await query(`SELECT * FROM ${table} WHERE ${idName} = $1`, [id]);
};

const deleteItemById = async (table, idName, id) => {
  return await query(`DELETE FROM ${table} WHERE ${idName} = $1`, [id]);
};

const insertItem = async (table, columns, values) => {
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
  return await query(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
};

export { getItems, getItemById, deleteItemById, insertItem };
