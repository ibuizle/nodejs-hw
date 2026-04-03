import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import authRouter from './routes/authRoutes.js';
import notesRouter from './routes/notesRoutes.js';

const bootstrap = async () => {
  await connectMongoDB();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(logger);
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use(authRouter);
  app.use(notesRouter);

  app.use(notFoundHandler);
  app.use(errors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();