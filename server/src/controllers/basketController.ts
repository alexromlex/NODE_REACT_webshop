import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/apiError';
import BasketService, { BasketServiceInterface } from '../services/basketService';

export default class BasketController {
  name: string;
  private readonly basketService: BasketServiceInterface;

  constructor() {
    this.name = 'BasketController';
    this.basketService = new BasketService();
  }
  async getBasketProducts(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>> [getBasket] called! ' + this.name);
    // console.log('BODY: ', req.body);
    let { user_id, product_id } = req.body;
    let basketCookieId = req.cookies.bsktId;
    // console.log('cookies: ', req.cookies);
    //guest with empty cookie
    if (!basketCookieId) return next(ApiError.notFound("Can't get basket from cookies!"));
    try {
      const result = await this.basketService.getBasketProducts({ user_id, product_id, basketCookieId });
      // console.log('[getBasketProducts] result: ', result);
      if (!result) return next(ApiError.notFound("Can't get basket products! See logs"));
      res.status(200).json(result);
    } catch (error: any) {
      return next(ApiError.invalid(error));
    }
  }

  async emptyBasket(req: Request, res: Response, next: NextFunction) {
    // If order is complete!
    const basketId = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    const resp = await this.basketService.emptyBasket(basketId);
    if (!resp) return next(ApiError.internal(`Can't delete. See logs`));
    return res.status(200).json({ removed: resp });
  }

  async deleteFromBasket(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>> [deleteFromBasket] called! ' + this.name);
    const { product_id, quantity } = req.body;
    const basketId = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    try {
      const result = await this.basketService.deleteFromBasket({ product_id, quantity, basketId });
      if (!result) return next(ApiError.internal(`Can't delete. See logs`));
      return res.status(200).json(result);
    } catch (error: any) {
      return next(ApiError.internal(error));
    }
  }

  async addToBasket(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>> [addToBasket] called! ' + this.name);
    const { product_id, quantity } = req.body;
    const basketId = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    if (!product_id || !quantity)
      return next(ApiError.notFound(`Product:${product_id} or Quantity:${quantity} not included!`));
    try {
      const resp = await this.basketService.addToBasket(Array(quantity).fill({ productId: product_id, basketId }));
      // console.log('resp: ', resp);
      return res.status(200).json({ added: resp.length });
    } catch (error) {
      return next(ApiError.notFound(error));
    }
  }
}
