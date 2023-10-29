import { Router } from 'express';
import { query } from '../config/db.js';
import {
  getItems,
  getItemById,
  deleteItemById,
  insertItem
} from '../config/dbHelpers.js';

const router = Router();
const table = 'tags';

router.post('/create', async (req, res) => {
  try {
      const { tag_name } = req.body;
      const newTag = await insertItem(table, ['tag_name'], [tag_name]);
      res.json(newTag.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await getItems(table)

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getItemById(table, id)

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
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
      const { tag_name } = req.body;
      const updateTag = await query('UPDATE tags SET tag_name = $1 WHERE tag_id = $2 RETURNING *', [tag_name, id] );
      res.json(updateTag.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deleteTag = await deleteItemById(table, id);
      res.json({ message: "Tag deleted successfully" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

export default router;
