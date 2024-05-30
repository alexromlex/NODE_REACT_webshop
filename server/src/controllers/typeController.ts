import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import TypeService, { TypeServiceInterface } from '../services/typeService';

export default class TypeController {
  private readonly typeService: TypeServiceInterface;
  constructor() {
    this.typeService = new TypeService();
  }

  async getAllTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await this.typeService.getAllTypes();
      res.status(200).json(types);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getOneType(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    try {
      const type = await this.typeService.getOneType(Number(id));
      if (!type) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(type);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, brands } = req.body;
    try {
      const type = await this.typeService.createType(name, brands);
      if (!type) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(type);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    const { name, brands } = req.body;
    try {
      const type = await this.typeService.updateType(Number(id), { name, brands });
      if (!type) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(type);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    try {
      const type = await this.typeService.deleteType(Number(id));
      return res.status(200).json(type);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
}
