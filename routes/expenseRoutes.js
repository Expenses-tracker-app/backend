import { Router } from 'express';
import { query } from '../config/db.js';
import {
  getItemById,
  deleteItemById
} from '../config/dbHelpers.js';

const router = Router();
const table = 'expenses';

router.post('/create', async (req, res) => {
  try {
      const { user_id, date, amount, desc, tag_id, is_rec, rec_freq } = req.body;
      const newExpense = await query(
          'INSERT INTO expenses (user_id, expense_date, expense_amount, expense_description, tag_id, is_recurring, recurring_frequency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [user_id, date, amount, desc, tag_id, is_rec, rec_freq]
      );
      res.json(newExpense.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /expense:
 *   get:
 *     summary: Retrieve a list of expenses
 *     responses:
 *       200:
 *         description: A list of expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/', async (req, res) => {
  try {
    const user_id = req.body.user.id;
    const result = await getItemById(table, user_id)

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/update/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { user_id, date, amount, desc, tag_id, is_rec, rec_freq } = req.body;
      const updateExpense = await query(
          'UPDATE expenses SET user_id = $1, expense_date = $2, expense_amount = $3, expense_description = $4, tag_id = $5, is_recurring = $6, recurring_frequency = $7 WHERE expense_id = $8 RETURNING *',
          [user_id, date, amount, desc, tag_id, is_rec, rec_freq, id]
      );
      res.json(updateExpense.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deleteExpense = await deleteItemById(table, id);
      res.json({ message: "Expense deleted successfully" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

export default router;
