import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import expensRoutes from './routes/expenseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World of Expenses and Incomes!');
  });

app.use('/expense', expensRoutes);