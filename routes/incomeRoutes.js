import { Router } from 'express';
import { query } from '../config/db.js';
import {
  getItemById,
  deleteItemById
} from '../config/dbHelpers.js';

const router = Router();
const table = 'incomes';

router.post('/create', async (req, res) => {
  try {
      const { user_id, date, amount, desc, tag_id } = req.body;
      const newIncome = await query(
          'INSERT INTO incomes (user_id, income_date, income_amount, income_description, tag_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [user_id, date, amount, desc, tag_id]
      );
      res.json(newIncome.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

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
      const { user_id, date, amount, desc, tag_id } = req.body;
      const updateIncome = await query(
          'UPDATE incomes SET user_id = $1, income_date = $2, income_amount = $3, income_description = $4, tag_id = $5 WHERE income_id = $6 RETURNING *',
          [user_id, date, amount, desc, tag_id, id]
      );
      res.json(updateIncome.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deleteIncome = await deleteItemById(table, id);
      res.json({ message: "Income deleted successfully" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

export default router;
