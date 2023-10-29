import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

router.post('/create', async (req, res) => {
  try {
      const { user_id, date, amount, desc, tag_id, is_rec, rec_freq } = req.body;
      const newExpense = await db.query(
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
    const result = await query('SELECT * FROM expenses WHERE user_id = $1', [user_id]);

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
      const { user_id, e_date, e_amount, e_desc, tag_id, is_rec, rec_freq } = req.body;
      const updateExpense = await db.query(
          'UPDATE expenses SET user_id = $1, expense_date = $2, expense_amount = $3, expense_description = $4, tag_id = $5, is_recurring = $6, recurring_frequency = $7 WHERE expense_id = $8 RETURNING *',
          [user_id, e_date, e_amount, e_desc, tag_id, is_rec, rec_freq, id]
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
      const deleteExpense = await db.query('DELETE FROM expenses WHERE expense_id = $1', [id]);
      res.json({ message: "Expense deleted successfully" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

export default router;
