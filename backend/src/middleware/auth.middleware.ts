import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  console.log('Auth middleware - Authorization header:', authorization ? 'Present' : 'Missing');

  if (!authorization) {
    console.log('Auth middleware - No authorization header');
    return res.status(401).json({ message: 'Unauthorized - No authorization header' });
  }

  if (!authorization.startsWith('Bearer')) {
    console.log('Auth middleware - Invalid authorization format');
    return res.status(401).json({ message: 'Unauthorized - Invalid format' });
  }

  const split = authorization.split('Bearer ');
  if (split.length !== 2) {
    console.log('Auth middleware - Invalid token format');
    return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
  }

  const token = split[1];
  console.log('Auth middleware - Token received, verifying...');

  try {
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Auth middleware - Token verified for user:', decodedToken.email);

    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    };
    return next();
  } catch (err: any) {
    console.error('Auth middleware - Token verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { role } = res.locals;
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};
