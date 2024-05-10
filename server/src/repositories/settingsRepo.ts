import { FindOptions, FindOrCreateOptions } from 'sequelize';
import { Settings, SettingsInterface } from '../database/models/models';
import BaseRepo from './baseRepo';

export interface SettingsRepositoryInterface {
  getAll(options?: FindOptions): Promise<SettingsInterface[]>;
  findByOptions(options: FindOptions): Promise<SettingsInterface | null>;
  findOrCreate(options?: FindOrCreateOptions): Promise<[SettingsInterface, boolean]>;
  update(id: number, values: Record<string, any>): Promise<SettingsInterface>;
}

export default class SettingsRepository extends BaseRepo<SettingsInterface> {
  constructor() {
    super(Settings);
  }
  async getAll(options: FindOptions = {}) {
    return super.getAll(options);
  }

  async findByOptions(options: FindOptions = {}) {
    return super.getOne(options);
  }

  async findOrCreate(options: FindOrCreateOptions = {}) {
    return this.model.findOrCreate(options);
  }

  async updateInstance(id: number, values: Record<string, any>) {
    return super.update(id, values);
  }
}
