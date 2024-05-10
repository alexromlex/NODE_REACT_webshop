import { FindOptions, Op } from 'sequelize';
import { SettingsInterface } from '../database/models/models';
import SettingsRepository, { SettingsRepositoryInterface } from '../repositories/settingsRepo';

export interface SettingsServiceInterface {
  getAll(options?: FindOptions): Promise<SettingsInterface[]>;
  getMainSettings(): Promise<SettingsInterface[]>;
  getGenTermsSettings(): Promise<SettingsInterface | null>;
  getPrivacyCondSettings(): Promise<SettingsInterface | null>;
  getBillingSettings(): Promise<SettingsInterface[]>;
  updateSettings(settings: any): Record<string, any>;
  createSettings(values: { name: string; value: string }[]): void;
}

export default class SettingsService implements SettingsServiceInterface {
  private readonly settingsRepository: SettingsRepositoryInterface;
  _name: string;
  constructor() {
    this.settingsRepository = new SettingsRepository();
    this._name = 'SettingsService';
  }

  async getAll(options: FindOptions = {}) {
    return await this.settingsRepository.getAll(options);
  }

  async getMainSettings() {
    return await this.settingsRepository.getAll({
      raw: true,
      where: { name: { [Op.in]: ['header_img', 'header_name'] } },
      attributes: ['name', 'value'],
    });
  }

  async getGenTermsSettings() {
    return await this.settingsRepository.findByOptions({
      raw: true,
      where: { name: 'general_terms' },
      attributes: ['value'],
    });
  }

  async getPrivacyCondSettings() {
    return await this.settingsRepository.findByOptions({
      raw: true,
      where: { name: 'privacy_policy' },
      attributes: ['value'],
    });
  }

  async getBillingSettings() {
    return await this.settingsRepository.getAll({
      raw: true,
      where: {
        name: {
          [Op.in]: [
            'billing_fullname',
            'billing_country',
            'billing_index',
            'billing_city',
            'billing_street',
            'billing_tax',
            'billing_bank_name',
            'billing_bank_account',
            'billing_bank_info',
          ],
        },
      },
      attributes: ['name', 'value'],
    });
  }

  async updateSettings(settings: any) {
    const updated = Object.fromEntries(settings.map(({ name }) => [name, false]));
    for (const s of settings) {
      if (!s.value || s.value === 'null') s.value = null;
      const _el = await this.settingsRepository.findByOptions({ where: { name: s.name } });
      if (_el) {
        await _el.update({ value: s.value });
        await _el.save();
        updated[s.name] = true;
      }
    }
    return updated;
  }

  async createSettings(values: { name: string; value: string }[]) {
    if (!values) return;
    values.forEach(async (v) => {
      await this.settingsRepository.findOrCreate({
        where: { name: v.name },
        defaults: {
          name: v.name,
          value: v.value,
        },
      });
    });
  }
}
