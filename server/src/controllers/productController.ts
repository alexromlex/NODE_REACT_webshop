import 'dotenv/config';
import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import ProductService, { ProductServiceInterface } from '../services/productService';

export default class ProductController {
  private readonly productService: ProductServiceInterface;
  name: string;
  constructor() {
    this.name = 'ProductController';
    this.productService = new ProductService();
  }
  async create(req: Request, res: Response, next: NextFunction) {
    let { name, price, rating, brandId, typeId, info } = req.body;
    [name, price, rating, brandId, typeId].forEach((el) => {
      if (!el || el === '' || el === 'null' || el === 'undefined') return next(ApiError.notFound(`Data is missing!`));
    });

    const image: typeof req.files = req.files;
    if (!image || !image['img']) return next(ApiError.notFound('No Image found!'));
    try {
      const result = await this.productService.createProduct({ name, price, rating, brandId, typeId, info, image });
      if (!result) return next(ApiError.internal(`Can't create product. See logs`));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async getAllAndCount(req: Request, res: Response, next: NextFunction) {
    const brandId = Number(req.query.brandId) || undefined,
      page = Number(req.query.page) || 1,
      limit = Number(req.query.limit) || 30,
      typeId = Number(req.query.typeId) || undefined,
      sort = req.query.sort || ['id', 'DESC'],
      v: string | undefined = req.query.v ? String(req.query.v) : undefined;

    try {
      const products = await this.productService.findAndCountAllProduct(
        brandId,
        typeId,
        sort as string[],
        v,
        page,
        limit
      );
      return res.status(200).json(products);
    } catch (error: any) {
      return next(ApiError.invalid(error.message));
    }
  }
  async getOne(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>>>>>>>>> [getOne] called!');
    const { id } = req.params;
    if (!id) return next(ApiError.invalid(`Product Id missing`));
    try {
      const product = await this.productService.getProductFullData(Number(id));
      if (!product) return next(ApiError.invalid('Not found!'));
      return res.status(200).json(product);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid(`Product Id missing`));
    try {
      const result = this.productService.deleteProductById(Number(id));
      if (!result) return next(ApiError.internal(`Can't delete product. See logs`));
      return res.status(200).json(Number(id));
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid(`Product Id missing`));
    const { name, price, rating, brandId, typeId, info } = req.body;
    [name, price, rating, brandId, typeId].forEach((el) => {
      if (!el || el === '' || el === 'null' || el === 'undefined') return next(ApiError.notFound(`Data is missing!`));
    });
    const image: typeof req.files = req.files;
    if (!image || !image.img) return next(ApiError.notFound(`Image is missing!`));
    try {
      const result = await this.productService.updateProduct(Number(id), {
        name,
        price,
        rating,
        brandId,
        typeId,
        image,
        info,
      });
      if (!result) return next(ApiError.internal(`Can't update product. See logs`));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }
}
