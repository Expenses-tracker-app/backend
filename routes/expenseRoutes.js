import { Router } from 'express';
import { query } from '../config/db.js';
import { getItemById, deleteItemById } from '../config/dbHelpers.js';

const router = Router();
const table = 'expenses';

/**
 * @swagger
 * /expense/create:
 *   post:
 *     tags:
 *       - Expenses
 *     summary: Create a new expense
 *     description: Add a new expense to the database.
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
 *               isRec:
 *                 type: boolean
 *               recFreq:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Created expense object
 *       '500':
 *         description: Server error
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, date, amount, desc, tagId, isRec, recFreq } = req.body;
    const newExpense = await query(
      'INSERT INTO expenses (user_id, expense_date, expense_amount, expense_description, tag_id, is_recurring, recurring_frequency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, date, amount, desc, tagId, isRec, recFreq]
    );
    res.json(newExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /expense/{id}:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Retrieve expenses for a user
 *     description: Fetch all expenses associated with a user from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user that owns the expenses.
 *     responses:
 *       '200':
 *         description: Array of expenses
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
        .json({ message: 'User not found  or the User does not have any expenses' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /expense/update/{id}:
 *   put:
 *     tags:
 *       - Expenses
 *     summary: Update an expense
 *     description: Modify an existing expense in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the expense to update.
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
 *               isRec:
 *                 type: boolean
 *               recFreq:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Updated expense object
 *       '500':
 *         description: Server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, amount, desc, tagId, isRec, recFreq } = req.body;
    const updateExpense = await query(
      'UPDATE expenses SET user_id = $1, expense_date = $2, expense_amount = $3, expense_description = $4, tag_id = $5, is_recurring = $6, recurring_frequency = $7 WHERE expense_id = $8 RETURNING *',
      [userId, date, amount, desc, tagId, isRec, recFreq, id]
    );
    res.json(updateExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /expense/delete/{id}:
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Delete an expense
 *     description: Remove an expense from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the expense to delete.
 *     responses:
 *       '200':
 *         description: Expense deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteItemById(table, 'expense_id', id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
