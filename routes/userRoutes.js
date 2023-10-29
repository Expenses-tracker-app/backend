import { Router } from 'express';
import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
    getItems,
    getItemById,
    deleteItemById,
    insertItem
  } from '../config/dbHelpers.js';

dotenv.config();
const router = Router();
const table = 'users';
const jwtSecret = process.env.JWT_SECRET;

/**
 * @swagger
 * /user/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Register a new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - psw
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               psw:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Created user object
 *       '400':
 *         description: User already exists
 *       '500':
 *         description: Server error
 */
router.post('/create', async (req, res) => {
    try {
        const { email, psw, username } = req.body;

        const user = await getItemById(table, 'email', email)

        if (user.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(psw, salt);

        const newUser = await query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a specific user by ID
 *     description: Fetch a user by its ID from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *     responses:
 *       '200':
 *         description: Single user object
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await query('SELECT user_id, username, email FROM users WHERE user_id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Modify an existing user's password and/or username in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to update.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               psw:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Updated user object
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { psw, username } = req.body;

        let hashedPassword = null;
        if (psw) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(psw, salt);
        }

        const user = await query(
            'UPDATE users SET username = $1, password = COALESCE($2, password) WHERE user_id = $3 RETURNING *',
            [username, hashedPassword, id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Remove a user from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to delete.
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await deleteItemById(table, 'user_id', id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;