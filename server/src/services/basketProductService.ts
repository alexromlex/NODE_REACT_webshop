import { BulkCreateOptions, FindOptions, UpdateOptions } from 'sequelize';
import BasketProductRepository, { BasketProductRepoInterface } from '../repositories/basketProductRepo';
import { BasketProductInterface } from '../database/models/models';
import ApiError from '../errors/apiError';

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
    if (!values || Object.keys(values).length === 0) throw ApiError.invalid(`Values are missing`);
    return await this.basketProductRepo.updateByOptions(values, options);
  }
  async bulkCreate(records: Record<string, any>[], options: BulkCreateOptions = {}) {
    if (!records || records.length === 0) throw ApiError.invalid(`records are missing`);
    return await this.basketProductRepo.bulkCreate(records, options);
  }
  async getAll(options?: FindOptions) {
    return await this.basketProductRepo.getAll(options);
  }
}
