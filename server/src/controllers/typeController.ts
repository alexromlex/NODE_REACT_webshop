import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import TypeService, { TypeServiceInterface } from '../services/typeService';

class TypeController {
  // private readonly typeService: TypeServiceInterface;
  constructor(private readonly typeService: TypeServiceInterface) {
    // this.typeService = new TypeService();
  }

  public async getAllTypes(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await this.typeService.getAllTypes());
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  public async getOneType(req: Request, res: Response, next: NextFunction) {
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

  public async create(req: Request, res: Response, next: NextFunction) {
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

  public async update(req: Request, res: Response, next: NextFunction) {
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

  public async delete(req: Request, res: Response, next: NextFunction) {
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
export default new TypeController(TypeService);
