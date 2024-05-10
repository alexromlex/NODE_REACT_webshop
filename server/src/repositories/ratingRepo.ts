import { CreateOptions, FindOptions } from 'sequelize';
import { Rating, RatingInterface } from '../database/models/models';
import BaseRepository from './baseRepo';

export interface RatingRepoInterface {
  create(values: Record<string, any>): Promise<RatingInterface>;
  deleteByOptions(options: FindOptions): Promise<number>;
}
export default class RatingRepository extends BaseRepository<RatingInterface> implements RatingRepoInterface {
  constructor() {
    super(Rating);
  }
  async create(values: Record<string, any>, options: CreateOptions = {}) {
    return super.create(values, options);
  }
  async deleteByOptions(options: FindOptions) {
    return this.model.destroy(options);
  }
}
