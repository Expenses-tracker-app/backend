import { Router } from 'express';
import { query } from '../config/db.js';
import { getItemById, deleteItemById } from '../config/dbHelpers.js';

const router = Router();
const table = 'incomes';

/**
 * @swagger
 * /income/create:
 *   post:
 *     tags:
 *       - Incomes
 *     summary: Create a new income
 *     description: Add a new income to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - date
 *               - amount
 *               - desc
 *               - tagId
 *             properties:
 *               userId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *                 format: double
 *               desc:
 *                 type: string
 *               tagId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Created income object
 *       '500':
 *         description: Server error
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, date, amount, desc, tagId } = req.body;
    const newIncome = await query(
      'INSERT INTO incomes (user_id, income_date, income_amount, income_description, tag_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, date, amount, desc, tagId]
    );
    res.json(newIncome.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /income/{id}:
 *   get:
 *     tags:
 *       - Incomes
 *     summary: Retrieve incomes for a user
 *     description: Fetch all incomes associated with a user from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user that owns the incomes.
 *     responses:
 *       '200':
 *         description: Array of incomes
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getItemById(table, 'user_id', id);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or the User does not have any incomes' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /income/update/{id}:
 *   put:
 *     tags:
 *       - Incomes
 *     summary: Update an income
 *     description: Modify an existing income in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the income to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *                 format: double
 *               desc:
 *                 type: string
 *               tagId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Updated income object
 *       '500':
 *         description: Server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, amount, desc, tagId } = req.body;
    const updateIncome = await query(
      'UPDATE incomes SET user_id = $1, income_date = $2, income_amount = $3, income_description = $4, tag_id = $5 WHERE income_id = $6 RETURNING *',
      [userId, date, amount, desc, tagId, id]
    );
    res.json(updateIncome.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /income/delete/{id}:
 *   delete:
 *     tags:
 *       - Incomes
 *     summary: Delete an income
 *     description: Remove an income from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the income to delete.
 *     responses:
 *       '200':
 *         description: Income deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteItemById(table, 'income_id', id);
    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
