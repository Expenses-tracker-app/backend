import { Router } from 'express';
import { query } from '../config/db.js';
import { getItems, getItemById, deleteItemById, insertItem } from '../config/dbHelpers.js';

const router = Router();
const table = 'tags';

/**
 * @swagger
 * /tag/create:
 *   post:
 *     tags:
 *       - Tags
 *     summary: Create a new tag
 *     description: Add a new tag to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tagName
 *             properties:
 *               tagName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Created tag object
 *       '500':
 *         description: Server error
 */
router.post('/create', async (req, res) => {
  try {
    const { tagName } = req.body;
    const newTag = await insertItem(table, ['tag_name'], [tagName]);
    res.json(newTag.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /tag:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Retrieve all tags
 *     description: Fetch all tags from the database.
 *     responses:
 *       '200':
 *         description: Array of tags
 *       '404':
 *         description: Tags not found
 *       '500':
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const result = await getItems(table);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /tag/{id}:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Retrieve a specific tag by ID
 *     description: Fetch a tag by its ID from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the tag to retrieve.
 *     responses:
 *       '200':
 *         description: Single tag object
 *       '404':
 *         description: Tag not found
 *       '500':
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getItemById(table, 'tag_id', id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /tag/update/{id}:
 *   put:
 *     tags:
 *       - Tags
 *     summary: Update a tag
 *     description: Modify an existing tag in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the tag to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Updated tag object
 *       '500':
 *         description: Server error
 */
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tagName } = req.body;
    const updateTag = await query('UPDATE tags SET tag_name = $1 WHERE tag_id = $2 RETURNING *', [
      tagName,
      id
    ]);
    res.json(updateTag.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /tag/delete/{id}:
 *   delete:
 *     tags:
 *       - Tags
 *     summary: Delete a tag
 *     description: Remove a tag from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the tag to delete.
 *     responses:
 *       '200':
 *         description: Tag deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteItemById(table, 'tag_id', id);
    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
