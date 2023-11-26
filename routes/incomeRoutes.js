import { Router } from 'express';
import { query } from '../config/db.js';
import { getItemById } from '../config/dbHelpers.js';
import { authenticateToken } from '../common/auth.js';

const router = Router();
const table = 'incomes';

/**
 * @swagger
 * /income/create:
 *   post:
 *     tags:
 *       - Incomes
 *     summary: Create a new income for the authenticated user
 *     description: Add a new income to the database for the authenticated user.
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
 *             properties:
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
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '500':
 *         description: Server error
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date, amount, desc, tagId } = req.body;
    const newIncome = await query(
      `INSERT INTO ${table} (user_id, income_date, income_amount, income_description, tag_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, date, amount, desc, tagId]
    );
    res.json(newIncome.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /income/:
 *   get:
 *     tags:
 *       - Incomes
 *     summary: Retrieve incomes for the authenticated user
 *     description: Fetch all incomes associated with the authenticated user from the database.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Array of incomes
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: User not found or the user does not have any incomes
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
        .json({ message: 'User not found or the User does not have any incomes' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /income/update:
 *   put:
 *     tags:
 *       - Incomes
 *     summary: Update an income for the authenticated user
 *     description: Modify an existing income in the database for the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - incomeId
 *               - date
 *               - amount
 *               - desc
 *               - tagId
 *             properties:
 *               incomeId:
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
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: Income not found or not owned by user
 *       '500':
 *         description: Server error
 */
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { incomeId, date, amount, desc, tagId } = req.body;

    const updateIncome = await query(
      `UPDATE ${table} SET income_date = $1, income_amount = $2, income_description = $3, tag_id = $4 WHERE income_id = $5 AND user_id = $6 RETURNING *`,
      [date, amount, desc, tagId, incomeId, userId]
    );

    if (updateIncome.rows.length === 0) {
      return res.status(404).json({ message: 'Income not found or not owned by user' });
    }

    res.json(updateIncome.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /income/delete:
 *   delete:
 *     tags:
 *       - Incomes
 *     summary: Delete an income for the authenticated user
 *     description: Deletes an income from the database. The income is identified by the incomeId and can only be deleted if it belongs to the authenticated user, who is identified through the JWT token provided in the httpOnly cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - incomeId
 *             properties:
 *               IncomeId:
 *                 type: integer
 *                 description: The ID of the income to delete
 *     responses:
 *       '200':
 *         description: Income deleted successfully
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: Income not found or not owned by user
 *       '500':
 *         description: Server error
 */
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { incomeId } = req.body;

    const result = await query(
      `DELETE FROM ${table} WHERE income_id = $1 AND user_id = $2 RETURNING *`,
      [incomeId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Income not found or not owned by user' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
