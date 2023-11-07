import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import expensRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiter
var limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.use(limiter);

const PORT = process.env.PORT || 8080;
const URL = process.env.NODE_ENV == 'production' ? process.env.URL : 'http://localhost:' + PORT;

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
        url: URL,
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

// Swagger docs
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/expense', expensRoutes);
app.use('/income', incomeRoutes);
app.use('/user', userRoutes);
app.use('/tag', tagRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World of Expenses and Incomes!');
});

// TODO: Add it to separate file for more complex checks
app.get('/healthcheck', (req, res) => {
  // Perform checks here
  // For example, you might want to check if your database connection is alive
  // or if essential services are up and running

  // If everything is okay, send back a positive response
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});