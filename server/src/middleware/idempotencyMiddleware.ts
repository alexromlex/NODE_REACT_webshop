import { idempotency, getSharedIdempotencyService } from 'express-idempotency';

export const requireIdempotencyKey = (req: any, res: any, next: any) => {
  const key = req.headers['idempotency-key'];
  
  if (!key) {
    return res.status(400).json({ 
      error: 'Idempotency-Key header is required' 
    });
  }
  
  next();
};


export const isIdempotencyHit = (req: any): boolean => {
  const service = getSharedIdempotencyService();
  const hit = service.isHit(req);
  return hit;
};

export const reportIdempotencyError = (req: any): void => {
  const service = getSharedIdempotencyService();
  service.reportError(req);
};