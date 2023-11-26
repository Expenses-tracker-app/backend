import { Router } from 'express';
import { query } from '../config/db.js';
import { getItemById } from '../config/dbHelpers.js';
import { authenticateToken } from '../common/auth.js';

const router = Router();
const table = 'expenses';

/**
 * @swagger
 * /expense/create:
 *   post:
 *     tags:
 *       - Expenses
 *     summary: Create a new expense for the authenticated user
 *     description: Adds a new expense to the database for the authenticated user. The user is identified through the JWT token provided in the httpOnly cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - amount
 *               - desc
 *               - tagId
 *               - isRec
 *               - recFreq
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the expense
 *               amount:
 *                 type: number
 *                 description: Amount of the expense
 *               desc:
 *                 type: string
 *                 description: Description of the expense
 *               tagId:
 *                 type: integer
 *                 description: ID of the expense tag/category
 *               isRec:
 *                 type: boolean
 *                 description: Indicates if the expense is recurring
 *               recFreq:
 *                 type: string
 *                 description: Frequency of the recurring expense (if applicable)
 *     responses:
 *       '200':
 *         description: Created expense object
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '500':
 *         description: Server error
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date, amount, desc, tagId, isRec, recFreq } = req.body;
    const newExpense = await query(
      `INSERT INTO ${table} (user_id, expense_date, expense_amount, expense_description, tag_id, is_recurring, recurring_frequency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, date, amount, desc, tagId, isRec, recFreq]
    );
    res.json(newExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /expense/:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Retrieve expenses for the authenticated user
 *     description: Fetch all expenses associated with the authenticated user from the database. The user is identified through the JWT token provided in the httpOnly cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Array of expenses for the authenticated user
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: User not found or the user does not have any expenses
 *       '500':
 *         description: Server error
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await getItemById(table, 'user_id', userId);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'User not found  or the User does not have any expenses' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /expense/update:
 *   put:
 *     tags:
 *       - Expenses
 *     summary: Update an existing expense for the authenticated user
 *     description: Updates an existing expense in the database for the authenticated user. The user is identified through the JWT token provided in the httpOnly cookie, and the expense to update is identified by the expenseId. The expense can only be updated if it belongs to the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expenseId
 *               - date
 *               - amount
 *               - desc
 *               - tagId
 *               - isRec
 *               - recFreq
 *             properties:
 *               expenseId:
 *                 type: integer
 *                 description: The ID of the expense to update
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date of the expense
 *               amount:
 *                 type: number
 *                 description: Updated amount of the expense
 *               desc:
 *                 type: string
 *                 description: Updated description of the expense
 *               tagId:
 *                 type: integer
 *                 description: Updated ID of the expense tag/category
 *               isRec:
 *                 type: boolean
 *                 description: Indicates if the updated expense is recurring
 *               recFreq:
 *                 type: string
 *                 description: Updated frequency of the recurring expense (if applicable)
 *     responses:
 *       '200':
 *         description: Uodated expense object
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: Expense not found or not owned by user
 *       '500':
 *         description: Server error
 */
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expenseId, date, amount, desc, tagId, isRec, recFreq } = req.body;

    const updateExpense = await query(
      `UPDATE ${table} SET expense_date = $1, expense_amount = $2, expense_description = $3, tag_id = $4, is_recurring = $5, recurring_frequency = $6 WHERE expense_id = $7 AND user_id = $8 RETURNING *`,
      [date, amount, desc, tagId, isRec, recFreq, expenseId, userId]
    );

    if (updateExpense.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found or not owned by user' });
    }

    res.json(updateExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /expense/delete:
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Delete an expense for the authenticated user
 *     description: Deletes an expense from the database. The expense is identified by the expenseId and can only be deleted if it belongs to the authenticated user, who is identified through the JWT token provided in the httpOnly cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expenseId
 *             properties:
 *               expenseId:
 *                 type: integer
 *                 description: The ID of the expense to delete
 *     responses:
 *       '200':
 *         description: Expense deleted successfully
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: Expense not found or not owned by user
 *       '500':
 *         description: Server error
 */
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expenseId } = req.body;

    const result = await query(
      `DELETE FROM ${table} WHERE expense_id = $1 AND user_id = $2 RETURNING *`,
      [expenseId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Expense not found or not owned by user' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
