import ApiError from '../errors/apiError';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
export default function (userRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.header('Authorization')?.split(`${process.env.TOKEN_PREFIX} `)[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
        jwt.verify(token, String(process.env.SECRET_KEY));
      } catch (error) {
        console.error(error);
      }

      const decoded: any = jwt.verify(token, String(process.env.SECRET_KEY));
      if (!userRoles.includes(decoded.role)) {
        return next(ApiError.forbidden('No permission!'));
      }
      //@ts-ignore
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
