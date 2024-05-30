import BaseRepository from './baseRepo';
import { Brand, BrandInterface, Type } from '../database/models/models';
import { CreateOptions, FindOptions } from 'sequelize';

export interface BrandRepoInterface {
  getAll(options?: FindOptions): Promise<BrandInterface[]>;
  getById(id: number, options?: FindOptions): Promise<BrandInterface | null>;
  create(values: Record<string, any>, options?: CreateOptions<BrandInterface>): Promise<BrandInterface>;
  update(instance: any, values: Record<string, any>): Promise<BrandInterface>;
  delete(id: number): Promise<BrandInterface | number>;
}
export default class BrandRepository extends BaseRepository<BrandInterface> implements BrandRepoInterface {
  constructor() {
    super(Brand);
  }
  async getAll(options: FindOptions = {}) {
    return super.getAll({
      ...options,
      include: options.include ? options.include : [{ model: Type, attributes: ['id', 'name'] }],
    });
  }

  async getById(id: number, options: FindOptions = {}) {
    const default_include = [{ model: Type, attributes: ['id', 'name'] }];
    return super.getById(id, { ...options, include: options.include ? options.include : default_include });
  }
  async create(values: Record<string, any>, options?: CreateOptions<BrandInterface>) {
    return super.create(values, options);
  }
  async update(instance: any, values: Record<string, any>) {
    const result = await instance.update(values);
    return result;
  }

  async delete(id: number) {
    return await super.delete(id);
  }
}
