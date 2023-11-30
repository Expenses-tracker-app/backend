import { Router } from 'express';
import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getItemById, deleteItemById } from '../config/dbHelpers.js';
import { authenticateToken } from '../common/auth.js';

dotenv.config();
const router = Router();
const table = 'users';
const jwtSecret = process.env.JWT_SECRET;

// Need to define the security scheme here so that it can be referenced in the swagger docs for Autentication
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:  # Custom name for the security scheme
 *       type: apiKey
 *       in: cookie
 *       name: token  # Name of the cookie used for authentication
 */

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
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               password:
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
    const { email, password, username } = req.body;
    const user = await getItemById(table, 'email', email);

    if (user.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await query(
      `INSERT INTO ${table} (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username, email`,
      [username, hashedPassword, email]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a specific user by ID
 *     description: Fetch a user by its ID from the database. Authentication is required for this endpoint and is handled via an HTTP-only cookie containing the JWT.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Single user object
 *       '404':
 *         description: User not found
 *       '401':
 *         description: Unauthorized - No valid authentication token provided
 *       '500':
 *         description: Server error
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await query(`SELECT user_id, username, email FROM ${table} WHERE user_id = $1`, [
      userId
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/update:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Modify an existing user's password and/or username in the database.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - username
 *              - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Updated frequency of the recurring expense (if applicable)
 *               password:
 *                 type: string
 *                 description: Updated description of the expense
 *     responses:
 *       '200':
 *         description: Updated user object
 *       '401':
 *         description: Unauthorized access (e.g., no token, invalid token)
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, password } = req.body;

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const user = await query(
      `UPDATE ${table} SET username = $1, password = COALESCE($2, password) WHERE user_id = $3 RETURNING user_id, username, email`,
      [username, hashedPassword, userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Remove a user from the database.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    await deleteItemById(table, 'user_id', userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: User login
 *     description: Authenticates a user by their email and password. If successful, sets an HTTP-only cookie with the JWT for session management.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful. A cookie named 'token' containing the JWT is set in the response.
 *       400:
 *         description: Invalid credentials. Either the email doesn't exist or the password is incorrect.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getItemById(table, 'email', email);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Account not found in the database' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // User is authenticated, now we generate a JWT
    const token = jwt.sign({ userId: user.rows[0].user_id }, jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 3600000
    });
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /user/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logs out the user
 *     description: Clears the HTTP-only cookie containing the JWT token, effectively logging out the user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful. The authentication cookie has been cleared.
 *       401:
 *         description: Unauthorized access (e.g., no token, invalid token). You must be logged in to log out.
 *       500:
 *         description: Internal server error. Indicates a server-side problem.
 */
router.post('/logout', authenticateToken, (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
