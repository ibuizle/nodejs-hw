import { isHttpError } from 'http-errors';

export const errorHandler = (error, _req, res, _next) => {
  if (isHttpError(error)) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: 'Something went wrong',
  });
};