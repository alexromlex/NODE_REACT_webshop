import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import OrderService, { OrderServiceInterface } from '../services/orderService';

export default class OrderController {
  private readonly orderService: OrderServiceInterface;
  constructor() {
    this.orderService = new OrderService();
  }

  async getAllOrder(req: Request, res: Response, next: NextFunction) {
    const status = req.query.status || undefined;
    const paid = req.query.paid || undefined;
    const options: any = { where: {} };
    if (paid !== undefined) options.where.paid = paid;
    if (status) options.where.status = status;
    try {
      res.status(200).json(await this.orderService.getAllOrder(options));
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const user = req.user;
    if (!user) return next(ApiError.notFound('User not recognised!'));
    try {
      res.status(200).json(await this.orderService.getUserOrders(Number(user.id)));
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    const { values } = req.body;
    const { id } = req.params;
    if (!values) return next(ApiError.notFound('Cant get values!'));
    if (!id) return next(ApiError.notFound('Cant get order id!'));
    try {
      const order = await this.orderService.updateOrder(Number(id), values);
      if (!order) return res.status(404).json('Not found!');
      return res.status(200).json(order);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
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
      const order = await this.orderService.cancelOrderByUser(Number(id), Number(user.id));
      if (!order) return next(ApiError.notFound('Cant find order by given options!'));
      return res.status(200).json(order);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async newOrder(req: Request, res: Response, next: NextFunction) {
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
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getOrderStatisticByStatus(req: Request, res: Response, next: NextFunction) {
    // console.log(`[${this.name} getOrderStatistic] called!`);
    let { startDate, endDate } = req.body;
    try {
      const result = await this.orderService.getOrderStatisticByStatus(startDate, endDate);
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getOrderStatisticAOV(req: Request, res: Response, next: NextFunction) {
    let { startDate, endDate } = req.body;
    try {
      const result = await this.orderService.getOrderStatisticAOV(startDate, endDate);
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getOrderProductBestSellers(req: Request, res: Response, next: NextFunction) {
    let { startDate, endDate } = req.body;
    try {
      const result = await this.orderService.getOrderProductBestSellers(startDate, endDate);
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async countOrderByStatus(req: Request, res: Response, next: NextFunction) {
    const { statuses } = req.body;
    try {
      const result = await this.orderService.countOrderByStatus(statuses);
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async monthlySales(req: Request, res: Response, next: NextFunction) {
    let { startDate, endDate, excludeStatuses } = req.body;
    try {
      const result = await this.orderService.monthlySales(startDate, endDate, excludeStatuses);
      if (!result) return next(ApiError.invalid("Can't get statistic, see logs!"));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
}
