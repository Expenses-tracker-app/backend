import { Router } from 'express';
import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const jwtSecret = process.env.JWT_SECRET;

router.post('/create', async (req, res) => {
    try {
        const { email, psw, username } = req.body;

        const user = await query('SELECT * FROM users WHERE email = $1', [email]);
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

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await query('DELETE FROM users WHERE user_id = $1', [id]);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;