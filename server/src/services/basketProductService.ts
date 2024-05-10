import { BulkCreateOptions, FindOptions, UpdateOptions } from 'sequelize';
import BasketProductRepository, { BasketProductRepoInterface } from '../repositories/basketProductRepo';
import { BasketProductInterface } from '../database/models/models';

export interface BasketProductServiceInterface {
  deleteByOptions(options?: FindOptions): Promise<number>;
  updateByOptions(values: Record<string, any>, options: UpdateOptions): Promise<any>;
  bulkCreate(records: Record<string, any>[], options?: BulkCreateOptions): Promise<BasketProductInterface[]>;
  getAll(options?: FindOptions): Promise<any>;
}

export default class BasketProductService {
  private readonly basketProductRepo: BasketProductRepoInterface;
  constructor() {
    this.basketProductRepo = new BasketProductRepository();
  }

  async deleteByOptions(options?: FindOptions) {
    return await this.basketProductRepo.deleteByOptions(options);
  }
  async updateByOptions(values: Record<string, any>, options: UpdateOptions) {
    return await this.basketProductRepo.updateByOptions(values, options);
  }
  async bulkCreate(records: Record<string, any>[], options: BulkCreateOptions = {}) {
    return await this.basketProductRepo.bulkCreate(records, options);
  }
  async getAll(options: FindOptions = {}) {
    return await this.basketProductRepo.getAll(options);
  }
}
