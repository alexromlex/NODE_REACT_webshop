import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import BrandService, { BrandServiceInterface } from '../services/brandService';

export default class BrandController {
  private readonly brandService: BrandServiceInterface;
  constructor() {
    this.brandService = new BrandService();
  }

  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await this.brandService.getAllBrands();
      res.status(200).json(brands);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, brands } = req.body;
    try {
      const brand = await this.brandService.createBrand(name, brands);
      if (!brand) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(brand);
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
      const brand = await this.brandService.updateBrand(Number(id), { name, brands });
      if (!brand) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(brand);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    try {
      const brand = await this.brandService.deleteBrand(Number(id));
      return res.status(200).json(brand);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
}
