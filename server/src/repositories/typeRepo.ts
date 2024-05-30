import BaseRepository from './baseRepo';
import { Brand, Type, TypeInterface } from '../database/models/models';
import { CreateOptions, FindOptions } from 'sequelize';

export interface TypeRepoInterface {
  getAll(options?: FindOptions): Promise<TypeInterface[]>;
  getById(id: number, options?: FindOptions): Promise<TypeInterface | null>;
  create(values: Record<string, any>, options?: CreateOptions<TypeInterface>): Promise<TypeInterface>;
  update(instance: any, values: Record<string, any>): Promise<TypeInterface>;
  delete(id: number): Promise<TypeInterface | number>;
}
export default class TypeRepository extends BaseRepository<TypeInterface> implements TypeRepoInterface {
  constructor() {
    super(Type);
  }
  async getAll(options: FindOptions = {}) {
    return super.getAll({
      ...options,
      include: options.include ? options.include : [{ model: Brand, attributes: ['id', 'name'] }],
    });
  }

  async getById(id: number, options: FindOptions = {}) {
    const default_include = [{ model: Brand, attributes: ['id', 'name'] }];
    return super.getById(id, { ...options, include: options.include ? options.include : default_include });
  }
  async create(values: Record<string, any>, options?: CreateOptions<TypeInterface>) {
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
