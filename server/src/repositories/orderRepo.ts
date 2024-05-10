import BaseRepository from './baseRepo';
import { OrderItem, Order, OrderInterface, Invoice } from '../database/models/models';
import { CreateOptions, FindOptions } from 'sequelize';

export interface OrderRepoInterface {
  getAll(options?: FindOptions): Promise<OrderInterface[]>;
  getById(id: number, options?: FindOptions): Promise<OrderInterface | null>;
  getByOptions(options?: FindOptions): Promise<OrderInterface | null>;
  create(values: Record<string, any>, options: CreateOptions<OrderInterface>): Promise<OrderInterface>;
  update(instance: any, values: Record<string, any>): Promise<OrderInterface>;
  delete(id: number): Promise<OrderInterface | number>;
  count(options: FindOptions): Promise<any>;
}
export default class OrderRepository extends BaseRepository<OrderInterface> implements OrderRepoInterface {
  private default_include = [{ model: OrderItem, as: 'item' }, Invoice];
  constructor() {
    super(Order);
  }
  async getAll(options: FindOptions = {}) {
    return super.getAll({ ...options, include: options.include ? options.include : this.default_include });
  }

  async getById(id: number, options: FindOptions = {}) {
    return super.getById(id, { ...options, include: options.include ? options.include : this.default_include });
  }
  async create(values: Record<string, any>, options?: CreateOptions<OrderInterface>) {
    return this.model.create(values, options);
  }
  async update(instance: any, values: Record<string, any>) {
    const result = await instance.update(values);
    return result;
  }

  async delete(id: number) {
    return await super.delete(id);
  }

  async getByOptions(options: FindOptions = {}) {
    return this.model.findOne({ ...options, include: options.include ? options.include : this.default_include });
  }

  async count(options: FindOptions = {}) {
    return this.model.count(options);
  }
}
