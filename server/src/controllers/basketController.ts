import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/apiError';
import BasketService, { BasketServiceInterface } from '../services/basketService';

export default class BasketController {
  private readonly basketService: BasketServiceInterface;

  constructor() {
    this.basketService = new BasketService();
  }
  async getBasketProducts(req: Request, res: Response, next: NextFunction) {
    let { user_id, product_id } = req.body;
    let basketId: number = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    try {
      const result = await this.basketService.getBasketProducts(Number(basketId), Number(user_id), Number(product_id));
      if (!result) return next(ApiError.notFound("Can't get basket products! See logs"));
      res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async emptyBasket(req: Request, res: Response, next: NextFunction) {
    const basketId: number = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    try {
      const resp = await this.basketService.emptyBasket(Number(basketId));
      if (!resp) return next(ApiError.internal(`Can't delete. See logs`));
      return res.status(200).json({ removed: resp });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async deleteFromBasket(req: Request, res: Response, next: NextFunction) {
    const { product_id, quantity } = req.body;
    const basketId: number = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    try {
      const result = await this.basketService.deleteFromBasket(Number(basketId), Number(product_id), Number(quantity));
      if (!result) return next(ApiError.internal(`Can't delete. See logs`));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async addToBasket(req: Request, res: Response, next: NextFunction) {
    const { product_id, quantity } = req.body;
    const basketId: number | null = req.cookies.bsktId;
    if (!basketId) return next(ApiError.notFound('Basket Id not foud!'));
    if (!product_id || !quantity)
      return next(ApiError.notFound(`Product:${product_id} or Quantity:${quantity} not included!`));
    try {
      const resp = await this.basketService.addToBasket(Number(basketId), Number(product_id), Number(quantity));
      return res.status(200).json({ added: resp.length });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
}
