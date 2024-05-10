import { CountWithOptions, FindOptions, GroupedCountResultItem } from 'sequelize';
import { User, UserInterface } from '../database/models/models';
import BaseRepo from './baseRepo';

export interface UserRepositoryInterface {
  create(values: Record<string, any>): Promise<UserInterface>;
  getAll(options?: FindOptions): Promise<UserInterface[]>;
  getById(id: number, options?: FindOptions): Promise<UserInterface | null>;
  findByOptions(options: FindOptions): Promise<UserInterface | null>;
  update(id: number, values: Record<string, any>): Promise<UserInterface>;
  delete(id: number): Promise<number>;
  count(options?: CountWithOptions): Promise<GroupedCountResultItem[]>;
}

export default class UserRepository extends BaseRepo<UserInterface> {
  constructor() {
    super(User);
  }

  async create(values: Record<string, any>) {
    return super.create(values);
  }

  async getAll(options: FindOptions = {}) {
    return super.getAll(options);
  }
  async getById(id: number, options: FindOptions = {}) {
    return super.getById(id, options);
  }
  async findByOptions(options: FindOptions) {
    console.log('findByOptions called! ' + options);
    return super.getOne(options);
  }
  async update(id: number, values: Record<string, any>) {
    return super.update(id, values);
  }
  async delete(id: number) {
    return super.delete(id);
  }
  async count(options: CountWithOptions = { group: ['id'] }) {
    return this.model.count(options);
  }
}
