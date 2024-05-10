import ApiError from '../errors/apiError';
import { Brand, Type } from '../database/models/models';
import BaseController from './baseController';
import { NextFunction, Request, Response } from 'express';
import TypeService, { TypeServiceInterface } from '../services/typeService';

export default class TypeController {
  name: string;
  private readonly typeService: TypeServiceInterface;
  constructor() {
    this.name = 'TypeController';
    this.typeService = new TypeService();
  }

  async getAllTypes(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER getAllTypes] called!');
    try {
      const types = await this.typeService.getAllTypes();
      res.status(200).json(types);
    } catch (error: any) {
      return next(ApiError.invalid(error));
    }
  }

  async getOneType(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER getOneType] called!');
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    try {
      const type = await this.typeService.getOneType(Number(id));
      if (!type) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(type);
    } catch (error: any) {
      return next(ApiError.invalid(error));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER create] called with body: ', req.body);
    const { name, brands } = req.body;
    try {
      const type = await this.typeService.createType(name, brands);
      if (!type) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(type);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER update] called with body: ', req.body, 'params: ', req.params);
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    const { name, brands } = req.body;
    try {
      const type = await this.typeService.updateType(Number(id), { name, brands });
      if (!type) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(type);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER delete] called with params: ', req.params);
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    try {
      const type = await this.typeService.deleteType(Number(id));
      return res.status(200).json(type);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }
}
