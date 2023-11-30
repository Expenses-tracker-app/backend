import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { authenticateToken } from './common/auth.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const URL = process.env.NODE_ENV === 'production' ? process.env.URL : 'http://localhost:' + PORT;

const app = express();
app.use(express.json());
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type']
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});
app.use(limiter);

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API Documentation for the Expense Tracker application'
    },
    servers: [
      {
        url: URL
      }
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: "Enter your JWT in the format 'Bearer <token>'"
      }
    }
  },
  apis: ['./routes/*.js']
};

// Swagger docs
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/expense', expenseRoutes);
app.use('/income', incomeRoutes);
app.use('/user', userRoutes);
app.use('/tag', tagRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World of Expenses and Incomes!');
});

// Authentication
app.get('/checkLogin', authenticateToken, (req, res) => {
  res.status(200).json({ isLoggedIn: true });
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
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
app
  .listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on('error', (err) => {
    console.error('Failed to start server:', err);
  });
