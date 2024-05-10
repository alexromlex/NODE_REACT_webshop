import BaseRepository from './baseRepo';
import { BasketProduct, BasketProductInterface } from '../database/models/models';
import { BulkCreateOptions, CreateOptions, FindOptions, UpdateOptions } from 'sequelize';

export interface BasketProductRepoInterface {
  deleteByOptions(options?: FindOptions): Promise<number>;
  updateByOptions(values: Record<string, any>, options: UpdateOptions): Promise<any>;
  create(values: Record<string, any>, options?: CreateOptions): Promise<BasketProductInterface>;
  getAll(options?: FindOptions): Promise<any>;
  bulkCreate(records: Record<string, any>[], options?: BulkCreateOptions): Promise<BasketProductInterface[]>;
}
export default class BasketProductRepository
  extends BaseRepository<BasketProductInterface>
  implements BasketProductRepoInterface
{
  constructor() {
    super(BasketProduct);
  }
  async deleteByOptions(options: FindOptions = {}) {
    return this.model.destroy(options);
  }
  async updateByOptions(values: Record<string, any>, options: UpdateOptions) {
    return this.model.update(values, options);
  }

  async create(values: Record<string, any>, options: CreateOptions = {}) {
    return super.create(values, options);
  }

  async getAll(options: FindOptions = {}) {
    return super.getAll(options);
  }
  async bulkCreate(records: Record<string, any>[], options: BulkCreateOptions = {}) {
    return this.model.bulkCreate(records, options);
  }
}
