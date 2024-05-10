import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import BasketService from '../services/basketService';

export default async function (req: Request, res: Response, next: NextFunction) {
  // console.log('[BasketMiddleware] called!');
  let { user_id } = req.body;
  const cookie = req.cookies;
  // console.log('user_id: ', user_id);
  // console.log('REQ Cookies: ', cookie);
  let basketId: number | null = null;
  // Check cookie for basketId
  if (cookie && cookie.bsktId) basketId = Number(cookie.bsktId);

  if (basketId && !user_id) {
    // find basket by basketId
    // console.log('basketId in cookie: ', basketId);
    const basket = await new BasketService().getBasket({ where: { id: basketId } });
    // console.log('getBasket: ', basket);
    if (basket) return next();
  }
  if (user_id) {
    const basket = await new BasketService().getBasket({ where: { userId: user_id } });
    // console.log('USER basket: ', basket);
    if (basket) {
      basketId = basket.id;
      res.cookie('bsktId', basketId, { expires: new Date(Date.now() + 86400e3), httpOnly: false });
      return next();
    }
  }

  try {
    const basket = await new BasketService().create({ userId: user_id ? user_id : null, temp: true });
    basketId = basket?.id;
    res.cookie('bsktId', basketId, { expires: new Date(Date.now() + 86400e3), httpOnly: false });
    // console.log('NEW temp basked created: ', basketId);
    return next();
  } catch (e: any) {
    next(ApiError.internal("Can't create basket, error: " + e));
  }
}
