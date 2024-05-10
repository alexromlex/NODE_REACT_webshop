import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import BrandService, { BrandServiceInterface } from '../services/brandService';

export default class BrandController {
  name: string;
  private readonly brandService: BrandServiceInterface;
  constructor() {
    this.name = 'BrandController';
    this.brandService = new BrandService();
  }

  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER getAllBrands] called!');
    try {
      const brands = await this.brandService.getAllBrands();
      res.status(200).json(brands);
    } catch (error: any) {
      return next(ApiError.invalid(error));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER create] called with body: ', req.body);
    const { name, brands } = req.body;
    try {
      const brand = await this.brandService.createBrand(name, brands);
      if (!brand) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(brand);
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
      const brand = await this.brandService.updateBrand(Number(id), { name, brands });
      if (!brand) return next(ApiError.notFound('Not found!'));
      return res.status(200).json(brand);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    // console.log('[CONTROLLER delete] called with params: ', req.params);
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('ID not included!'));
    try {
      const brand = await this.brandService.deleteBrand(Number(id));
      return res.status(200).json(brand);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }
}
