require('dotenv').config();

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import * as middlewares from './middlewares';
import api from './api';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser())
app.use(express.json());

// Use /api/index.ts, which imports all the other api endpoints in /api
// Nice because the file structure matches the actual endpoint
app.use('/api', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
