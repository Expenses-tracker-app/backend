import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import expensRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import Client from 'pg';

dotenv.config();
const app = express();
const client = new Client({connectionString: process.env.DATABASE_URL})
await client.connect()
.then(() => console.log('Connected to the database successfully'))
.catch(e => console.error('Failed to connect to the database', e));

const PORT = process.env.PORT || 4000;
const URL = process.env.URL || 'http://localhost:';

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API Documentation for the Expense Tracker application',
    },
    servers: [
      {
        url: URL + PORT,
      },
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: "Enter your JWT in the format 'Bearer <token>'",
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());

app.use('/expense', expensRoutes);
app.use('/income', incomeRoutes);
app.use('/user', userRoutes);
app.use('/tag', tagRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World of Expenses and Incomes!');
  });