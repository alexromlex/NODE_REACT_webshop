import BaseRepository from './baseRepo';
import { Basket, BasketInterface } from '../database/models/models';
import { FindOptions } from 'sequelize';

export interface BasketRepoInterface {
  create(values: Record<string, any>): Promise<BasketInterface>;
  getOneByOptions(options: FindOptions): Promise<BasketInterface | null>;
  deleteByOptions(options: FindOptions): Promise<number>;
}
export default class BasketRepository extends BaseRepository<BasketInterface> implements BasketRepoInterface {
  constructor() {
    super(Basket);
  }
  async deleteByOptions(options: FindOptions) {
    return this.model.destroy(options);
  }

  async create(values: Record<string, any>) {
    return super.create(values);
  }

  async getOneByOptions(options: FindOptions) {
    return super.getOne(options);
  }
}
