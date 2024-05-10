import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import SettingsService, { SettingsServiceInterface } from '../services/settingsService';

export default class SettingsController {
  private readonly settingsService: SettingsServiceInterface;
  _name: string;
  constructor() {
    this.settingsService = new SettingsService();
    this._name = 'SettingsController';
  }

  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.settingsService.getAll();
      if (!result) return next(ApiError.internal(`Can't get settings. See logs`));
      return res.json({ settings: result });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getMainSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.settingsService.getMainSettings();
      if (!result) return next(ApiError.internal(`Can't get settings. See logs`));
      return res.json(Object.fromEntries(result.map(({ name, value }) => [name, value])));
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getGenTermsSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.settingsService.getGenTermsSettings();
      if (!result) return next(ApiError.internal(`Can't get settings. See logs`));
      return res.json(result.value);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
  async getPrivacyCondSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.settingsService.getPrivacyCondSettings();
      if (!result) return next(ApiError.internal(`Can't get settings. See logs`));
      return res.json(result.value);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
  async getBillingSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.settingsService.getBillingSettings();
      if (!result) return next(ApiError.internal(`Can't get settings. See logs`));
      return res.json(Object.fromEntries(result.map(({ name, value }) => [name, value])));
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    let { settings } = req.body;
    if (!settings || settings.length === 0) return next(ApiError.invalid('Settings is empty'));
    try {
      const result = await this.settingsService.updateSettings(settings);
      if (!result) return next(ApiError.internal(`Can't get settings. See logs`));
      return res.json({ updated: result });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
}
