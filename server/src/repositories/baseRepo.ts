import { CreateOptions, FindOptions, ModelStatic } from 'sequelize';
import ApiError from '../errors/apiError';

export default abstract class BaseRepo<A> {
  model: ModelStatic<any>;
  private default_order = [['createdAt', 'DESC']];

  constructor(model: ModelStatic<any>) {
    this.model = model;
  }

  async getAll(options: FindOptions): Promise<A[]> {
    // if (!Object.keys(options).includes('order')) options.order = this.default_order;
    return this.model.findAll({
      ...options,
      //@ts-ignore
      order: options.order ? options.order : this.default_order,
    });
  }

  async getById(id: number | string, options?: FindOptions): Promise<A | null> {
    return this.model.findByPk(id, options);
  }

  async getOne(options: FindOptions): Promise<A | null> {
    return this.model.findOne(options);
  }

  async create(values: Record<string, any>, options?: CreateOptions<A>): Promise<A> {
    return this.model.create(values, options);
  }

  async update(id: number | string, values: Record<string, any>): Promise<A> {
    const instance = await this.model.findByPk(id);
    if (!instance) {
      throw ApiError.notFound('Entity not found');
    }
    return instance.update(values);
  }

  async delete(id: number | string): Promise<number> {
    const instance = await this.model.findByPk(id);
    if (!instance) {
      throw ApiError.notFound('Entity not found');
    }
    return await instance.destroy();
  }
}
