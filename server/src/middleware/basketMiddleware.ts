import { NextFunction, Request, Response } from 'express';
import BasketService from '../services/basketService';
import { BasketInterface } from '../database/models/models';

export default async function (req: Request, res: Response, next: NextFunction) {
  const user_id = Number(req.body.user_id) || undefined;
  const cookie = req.cookies;
  let basketId: number | null = null;
  if (cookie && cookie.bsktId) basketId = Number(cookie.bsktId);
  const basketService = new BasketService();
  let basket: BasketInterface | null = null;

  if (basketId && !user_id) {
    basket = await basketService.getBasket(basketId);
    if (basket) return next();
  }

  if (user_id) {
    basket = await basketService.getBasket(undefined, Number(user_id));
  }

  if (!basket || basket.userId !== user_id) basket = await basketService.createBasket(user_id, true);

  res.cookie('bsktId', basket.id, { expires: new Date(Date.now() + 86400e3), httpOnly: false });
  return next();
}
