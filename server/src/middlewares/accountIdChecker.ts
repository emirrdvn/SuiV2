import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['address'] as string | undefined;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return; // Ensure the function exits after sending a response
  }

  next(); // Proceed to the next middleware or route handler
};
