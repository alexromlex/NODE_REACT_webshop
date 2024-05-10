import { Filterable, FindOptions, IncludeOptions, Op, Optional } from 'sequelize';
import OrderRepoInterface from '../repositories/orderRepo';
import OrderRepository from '../repositories/orderRepo';
import {
  Basket,
  BasketProduct,
  Brand,
  Invoice,
  Order,
  OrderInterface,
  OrderItem,
  ProductInfo,
  Type,
} from '../database/models/models';
import ApiError from '../errors/apiError';
import BasketService from './basketService';
import ProductService from './productService';
import sequelize from '../database/connect';

function sliceObject(obj: any, len: number) {
  if (Object.keys(obj).length <= len) return obj;
  let p = Object.keys(obj).slice(Object.keys(obj).length - 5);
  return Object.fromEntries(p.map((v) => [v, obj[v]]));
}
export interface OrderServiceInterface {
  getAllOrder(values: Record<string, any>): Promise<OrderInterface[]>;
  getUserOrders(user: Record<string, any>): Promise<OrderInterface[]>;
  updateOrder(id: number, values: Record<string, any>): Promise<OrderInterface | null>;
  cancelOrderByUser(id: number, user: Record<string, any>): Promise<OrderInterface | null>;
  newOrder(values: Record<string, any>): Promise<{ orderId: number }>;
  getOrderStatisticByStatus(values: Record<string, any>): Promise<any>;
  getOrderStatisticAOV(values: Record<string, any>): Promise<any>;
  getOrderProductBestSellers(values: Record<string, any>): Promise<any>;
  countOrderByStatus(values: Record<string, any>): Promise<any>;
  monthlySales(values: Record<string, any>): Promise<any>;
}
export default class OrderService implements OrderServiceInterface {
  name: string;
  private readonly orderRepo: OrderRepoInterface;
  orderStatuses = ['new', 'invoiced', 'released', 'fulfilled', 'holded', 'cancelled'];
  constructor() {
    this.orderRepo = new OrderRepository();
    this.name = 'OrderService';
  }

  async getAllOrder(values: Record<string, any> = {}) {
    // console.log(`[${this.name} getAllOrder] called!`);
    // console.log('options: ', options);
    const options: Record<string, any> = { where: {} };
    if (values.status && this.orderStatuses.includes(String(values.status))) options.where.status = values.status;
    if (values.paid) options.where.paid = values.paid;
    return await this.orderRepo.getAll({ ...options });
  }

  async getUserOrders(user: Record<string, any>) {
    // console.log(`[${this.name} getUserOrders] called!`);
    return await this.orderRepo.getAll({ where: { userId: user.id }, order: [['createdAt', 'DESC']] });
  }

  async updateOrder(id: number, values: Record<string, any>) {
    // console.log(`[${this.name} updateOrder] called!`);
    let order = await this.orderRepo.getById(id);
    // console.log('order found: ', order);
    if (order) {
      order = await this.orderRepo.update(order, values);
    }
    return order;
  }

  async cancelOrderByUser(id: number, user: Record<string, any>) {
    // console.log(`[${this.name} cancelOrderByUser] called!'`);
    let order = await this.orderRepo.getByOptions({ where: { id: id, userId: user.id } });
    if (order) {
      if (order.status != 'new') throw ApiError.invalid('Order status NOT new');
      order = await this.orderRepo.update(order, { status: 'cancelled' });
    }
    return order;
  }

  async newOrder(values: Record<string, any>) {
    // console.log(`[${this.name} newOrder] called!'`);

    const products = await new ProductService().getAllProduct({
      include: [
        {
          model: ProductInfo,
          as: 'info',
          attributes: ['title', 'description'],
        },
        { model: Type, attributes: ['name'] },
        { model: Brand, attributes: ['name'] },
      ],
      where: { id: { [Op.in]: values.basket_items.map((p: any) => p.id) } },
    });

    let calcAmount = 0;
    const items: any = [];
    products.forEach((p: any) => {
      const indx = values.basket_items.findIndex(({ id }) => id === p.id);
      if (indx > -1) {
        calcAmount += p.price * values.basket_items[indx].quantity;
        items.push({
          name: p.name,
          info: p.info,
          price: Number(p.price),
          quantity: values.basket_items[indx].quantity,
          product_id: p.id,
          type_name: p.type.name,
          brand_name: p.brand.name,
        });
      }
    });
    if (values.amount !== calcAmount) throw ApiError.notFound('Problem with order amount calculating');
    const invoice = {
      seller: { name: 'Webshop' },
      buyer: values.invoiceData,
      delivery: values.deliveryData,
      userId: values.user.id,
    };
    const order = await this.orderRepo.create(
      {
        amount: values.amount + values.shipping.price + values.payment.price,
        shipping: values.shipping,
        payment: values.payment,
        status: 'new', // new, invoiced, released
        userId: values.user.id,
        item: items,
        invoice: invoice,
      },
      { include: [{ model: OrderItem, as: 'item' }, Invoice] }
    );
    if (!order) throw ApiError.notFound('Cant create new order!');
    const basketService = new BasketService();
    const basket = await basketService.getBasket({ where: { userId: values.user.id } });
    if (!basket) throw ApiError.notFound('Cant find user basket!');
    if (basket) {
      await basketService.deleteProductFromBasketByOptions({ where: { basketId: basket.id } });
    }
    return { orderId: order.id };
  }

  async getOrderStatisticByStatus(values: Record<string, any>) {
    const condition: any = { where: {}, raw: false };
    if (values.startDate && values.endDate)
      condition.where['createdAt'] = { [Op.between]: [values.startDate, values.endDate] };
    const grouped: any = {};
    const orders = await this.orderRepo.getAll({ ...condition, include: [] });
    orders.forEach((el: any) => {
      const month = new Date(el.createdAt).getMonth();
      if (!grouped[month]) {
        grouped[month] = { [el.status]: 1 };
      } else if (!grouped[month][el.status]) {
        grouped[month][el.status] = 1;
      } else {
        grouped[month][el.status] += 1;
      }
    });
    return grouped;
  }

  async getOrderStatisticAOV(values: Record<string, any>) {
    const condition: any = { where: { status: { [Op.ne]: 'cancelled' } }, raw: false };
    if (values.startDate && values.endDate)
      condition.where['createdAt'] = { [Op.between]: [values.startDate, values.endDate] };
    const orders = await this.orderRepo.getAll({
      ...condition,
      include: [
        {
          model: OrderItem,
          as: 'item',
          attributes: ['name', 'price', 'quantity', 'brand_name', 'type_name'],
        },
      ],
    });
    const grouped: any = {};
    orders.forEach((el: any) => {
      const month = new Date(el.createdAt).getMonth();
      if (!grouped[month]) {
        grouped[month] = { orderQty: 1, sales: el.amount, av: el.amount };
      } else {
        grouped[month] = {
          orderQty: grouped[month].orderQty + 1,
          sales: grouped[month].sales + el.amount,
          av: (grouped[month].sales + el.amount) / (grouped[month].orderQty + 1),
        };
      }
    });
    return grouped;
  }
  async getOrderProductBestSellers(values: Record<string, any>) {
    const condition: any = { where: { status: { [Op.ne]: 'cancelled' } }, raw: false };
    if (values.startDate && values.endDate)
      condition.where['createdAt'] = { [Op.between]: [values.startDate, values.endDate] };
    const orders = await this.orderRepo.getAll({
      ...condition,
      include: [
        {
          model: OrderItem,
          as: 'item',
          attributes: ['name', 'price', 'quantity', 'brand_name', 'type_name'],
        },
      ],
    });
    const grouped: any = {
      products: {},
      types: {},
      brands: {},
    };
    orders.forEach((order) => {
      order.item!.forEach((item: any) => {
        grouped.products[item.name] = !grouped.products[item.name]
          ? item.quantity
          : (grouped.products[item.name] += item.quantity);

        grouped.types[item.type_name] = !grouped.types[item.type_name]
          ? item.quantity
          : (grouped.types[item.type_name] += item.quantity);

        grouped.brands[item.brand_name] = !grouped.brands[item.brand_name]
          ? item.quantity
          : (grouped.brands[item.brand_name] += item.quantity);
      });
    });
    for (const [k, v] of Object.entries(grouped)) {
      // @ts-ignore
      let sorted = Object.fromEntries(Object.entries(v).sort(([, a], [, b]) => a - b));
      grouped[k] = sliceObject(sorted, 5);
    }
    return grouped;
  }

  async countOrderByStatus(values: Record<string, any>) {
    const condition: any = { where: {} };
    if (values.statuses && values.statuses.length > 0) condition.where.status = { [Op.in]: values.statuses };
    // console.log(condition);
    const orderCount = await this.orderRepo.count({ ...condition, group: ['status'] });
    // @ts-ignore
    const result = Object.fromEntries(orderCount.map(({ status, count }) => [status, count]));
    return result;
  }

  async monthlySales(values: Record<string, any>) {
    const condition: any = { where: {} };
    if (values.startDate && values.endDate)
      condition.where.createdAt = { [Op.between]: [values.startDate, values.endDate] };
    if (values.excludeStatuses) condition.where.status = { [Op.notIn]: values.excludeStatuses };
    condition.attributes = [
      [sequelize.literal(`extract(month from "createdAt")`), 'month'],
      [sequelize.literal(`SUM(amount)`), 'sum'],
    ];
    const result = await this.orderRepo.getAll({ ...condition, include: [], group: ['month'], order: [] });
    return result;
  }
}
