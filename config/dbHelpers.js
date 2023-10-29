import { query } from './db.js';

const getItems = async (table) => {
    return await query(`SELECT * FROM ${table}`);
};

const getItemById = async (table, id) => {
    return await query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
};

const deleteItemById = async (table, id) => {
    return await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
};

const insertItem = async (table, columns, values) => {
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    return await query(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`, values);
};

module.exports = {
    getItems,
    getItemById,
    deleteItemById,
    insertItem
};
