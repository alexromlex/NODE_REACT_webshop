import { BulkCreateOptions, FindOptions } from 'sequelize';
import { ProductInfo, ProductInfoInterface } from '../database/models/models';
import BaseRepository from './baseRepo';

export interface ProductInfoRepoInterface {
  bulkCreate(records: Record<string, any>[], options?: BulkCreateOptions): Promise<any>;
  deleteByOptions(options: FindOptions): Promise<number>;
}
export default class ProductInfoRepository
  extends BaseRepository<ProductInfoInterface>
  implements ProductInfoRepoInterface
{
  constructor() {
    super(ProductInfo);
  }
  async bulkCreate(records: Record<string, any>[], options?: BulkCreateOptions | undefined) {
    return this.model.bulkCreate(records, options);
  }
  async deleteByOptions(options: FindOptions) {
    return this.model.destroy(options);
  }
}
