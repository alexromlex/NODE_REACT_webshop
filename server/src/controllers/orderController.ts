import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import OrderService, { OrderServiceInterface } from '../services/orderService';

export default class OrderController {
  name: string;
  private readonly orderService: OrderServiceInterface;
  constructor() {
    this.name = 'OrderController';
    this.orderService = new OrderService();
  }

  async getAllOrder(req: Request, res: Response, next: NextFunction) {
    const { status, paid } = req.query;
    try {
      const orders = await this.orderService.getAllOrder({ status, paid });
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return next(ApiError.notFound(error));
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const user = req.user;
    if (!user) return next(ApiError.notFound('User not recognised!'));
    try {
      const orders = await this.orderService.getUserOrders(user);
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return next(ApiError.notFound(error));
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    // console.log(`[${this.name} updateOrder] called!'`);
    const { values } = req.body;
    const { id } = req.params;
    if (!values) return next(ApiError.notFound('Cant get values!'));
    if (!id) return next(ApiError.notFound('Cant get order id!'));
    try {
      const order = await this.orderService.updateOrder(Number(id), values);
      if (!order) return res.status(404).json('Not found!');
      return res.status(200).json(order);
    } catch (error: any) {
      console.error(error);
      return next(ApiError.notFound(error));
    }
  }

  async cancelOrderByUser(req: Request, res: Response, next: NextFunction) {
    // console.log(`[${this.name} cancelOrderByUser] called!'`);
    const { id } = req.body;
    if (!id) return next(ApiError.notFound('Cant get order id!'));
    //@ts-ignore
    const user = req.user;
    if (!user) return next(ApiError.notFound('User not recognised!'));
    try {
      const order = await this.orderService.cancelOrderByUser(id, user);
      if (!order) return next(ApiError.notFound('Cant find order by given options!'));
      return res.status(200).json(order);
    } catch (error: any) {
      console.error(error);
      return next(ApiError.invalid(error));
    }
  }

  async newOrder(req: Request, res: Response, next: NextFunction) {
    // console.log(`'[${this.name} newOrder] called!'`);
    const { basket_items, amount, deliveryData, invoiceData, shipping, payment } = req.body;
    //@ts-ignore
    const user = req.user;
    if (!user) return next(ApiError.notFound('User not recognised!'));
    if (!basket_items || !deliveryData || !invoiceData || !shipping || !payment)
      return next(ApiError.notFound('Missing data!'));
    if (basket_items.length === 0) return next(ApiError.notFound('Basket is empty!'));
    try {
      const result = await this.orderService.newOrder({
        basket_items,
        amount,
        deliveryData,
        invoiceData,
        shipping,
        payment,
        user,
      });
      if (!result) return next(ApiError.internal('Error see logs...'));
      return res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return next(ApiError.notFound(error));
    }
  }

  async getOrderStatisticByStatus(req: Request, res: Response, next: NextFunction) {
    // console.log(`[${this.name} getOrderStatistic] called!`);
    let { startDate, endDate } = req.body;
    try {
      const result = await this.orderService.getOrderStatisticByStatus({ startDate, endDate });
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return next(ApiError.invalid(error));
    }
  }

  async getOrderStatisticAOV(req: Request, res: Response, next: NextFunction) {
    let { startDate, endDate } = req.body;
    try {
      const result = await this.orderService.getOrderStatisticAOV({ startDate, endDate });
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return next(ApiError.invalid(error));
    }
  }

  async getOrderProductBestSellers(req: Request, res: Response, next: NextFunction) {
    let { startDate, endDate } = req.body;
    try {
      const result = await this.orderService.getOrderProductBestSellers({ startDate, endDate });
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return next(ApiError.invalid(error));
    }
  }

  async countOrderByStatus(req: Request, res: Response, next: NextFunction) {
    const { statuses } = req.body;
    try {
      const result = await this.orderService.countOrderByStatus({ statuses });
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return next(ApiError.invalid(error));
    }
  }

  async monthlySales(req: Request, res: Response, next: NextFunction) {
    let { startDate, endDate, excludeStatuses } = req.body;
    try {
      const result = await this.orderService.monthlySales({ startDate, endDate, excludeStatuses });
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return next(ApiError.invalid(error));
    }
  }
}
