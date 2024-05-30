import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
export default function (req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') next();
  try {
    const token = req.header('Authorization')?.split(`${process.env.TOKEN_PREFIX} `)[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
