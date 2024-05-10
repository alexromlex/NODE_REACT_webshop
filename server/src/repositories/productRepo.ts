import BaseRepository from './baseRepo';
import { Brand, Product, ProductInfo, ProductInterface, Type } from '../database/models/models';
import { FindOptions } from 'sequelize';
import sequelize from 'sequelize';

export interface ProductRepoInterface {
  getAll(options?: FindOptions): Promise<ProductInterface[]>;
  getById(id: number, options?: FindOptions): Promise<ProductInterface | null>;
  create(values: Record<string, any>): Promise<ProductInterface>;
  update(instance: any, values: Record<string, any>): Promise<ProductInterface>;
  deleteByOptions(options: FindOptions): Promise<number>;
  getProductFullData(id: number): Promise<ProductInterface | null>;
  findAndCountAll(
    conditions: Record<string, any>,
    limit: number,
    offset: number,
    sort: string[]
  ): Promise<{ rows: ProductInterface[]; count: number }>;
}
export default class ProductRepository extends BaseRepository<ProductInterface> implements ProductRepoInterface {
  constructor() {
    super(Product);
  }

  async getProductFullData(id: number) {
    return await super.getById(id, {
      include: [
        { model: ProductInfo, as: 'info' },
        { model: Brand, attributes: ['id', 'name'] },
        { model: Type, attributes: ['id', 'name'] },
      ],
      attributes: {
        include: [
          [sequelize.literal(`(SELECT AVG(rate) FROM ratings AS rating WHERE "productId" = product.id)`), 'rating'],
        ],
      },
    });
  }

  async getAll(options: FindOptions = {}) {
    return super.getAll({
      ...options,
      include: options.include ? options.include : [{ model: ProductInfo, as: 'info' }],
    });
  }

  async getById(id: number, options: FindOptions = {}) {
    console.log({
      ...options,
      include: options.include ? options.include : [{ model: ProductInfo, as: 'info' }],
    });
    return super.getById(id, {
      ...options,
      include: options.include ? options.include : [{ model: ProductInfo, as: 'info' }],
    });
  }

  async create(values: Record<string, any>) {
    return super.create(values);
  }
  async update(instance: any, values: Record<string, any>) {
    const result = await instance.update(values);
    return result;
  }

  async deleteByOptions(options: FindOptions) {
    return this.model.destroy(options);
  }

  async findAndCountAll(
    conditions: Record<string, any> = {},
    limit: number,
    offset: number,
    sort: [string, string]
  ): Promise<{ rows: ProductInterface[]; count: number }> {
    return this.model.findAndCountAll({
      ...conditions,
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: Type, attributes: ['id', 'name'] },
        { model: ProductInfo, as: 'info' },
      ],
      attributes: {
        include: [
          [sequelize.literal(`(SELECT AVG(rate) FROM ratings AS rating WHERE "productId" = product.id)`), 'rating'],
        ],
      },
      limit,
      offset,
      distinct: true,
      order: [sort],
    });
  }
}
