import 'dotenv/config';
import { ProductInterface } from '../database/models/models';
import ApiError from '../errors/apiError';
import { FindOptions, Op } from 'sequelize';
import sequelize from '../database/connect';
import ProductRepository, { ProductRepoInterface } from '../repositories/productRepo';
import RatingRepository, { RatingRepoInterface } from '../repositories/ratingRepo';
import ProductInfoRepository, { ProductInfoRepoInterface } from '../repositories/productInfoRepo';
import { deleteImage, generateImageName, saveImage } from '../utils';

export interface ProductServiceInterface {
  findAndCountAllProduct(
    brandId: number | undefined,
    typeId: number | undefined,
    sort: string[],
    v: string | undefined,
    page: number,
    limit: number
  ): Promise<{ rows: ProductInterface[]; count: number }>;
  getAllProduct(options?: FindOptions): Promise<ProductInterface[]>;
  createProduct(values: Record<string, any>): Promise<ProductInterface | null>;
  getProductFullData(id: number): Promise<ProductInterface | null>;
  deleteProductById(id: number): Promise<number>;
  updateProduct(id: number, values: Record<string, any>): Promise<ProductInterface | null>;
}

export default class ProductService implements ProductServiceInterface {
  private readonly productRepo: ProductRepoInterface;
  private readonly ratingRepo: RatingRepoInterface;
  private readonly productInfoRepo: ProductInfoRepoInterface;
  constructor() {
    this.productRepo = new ProductRepository();
    this.ratingRepo = new RatingRepository();
    this.productInfoRepo = new ProductInfoRepository();
  }

  async getProductFullData(id: number) {
    if (!id) throw ApiError.invalid(`Product Id required`);
    return this.productRepo.getProductFullData(id);
  }

  async createProduct(values: Record<string, any>) {
    if (!values || Object.keys(values).length === 0) throw ApiError.invalid('values are missing');
    const { name, price, rating, brandId, typeId, info, image } = values;
    const fileName = generateImageName(name);
    try {
      return await sequelize.transaction(async () => {
        if (!(await saveImage(image['img'], fileName))) throw ApiError.internal('Cant upload Image!');
        let newProduct = await this.productRepo.create({ name, price, brandId, typeId, img: fileName });
        if (!newProduct) throw ApiError.internal(`Can't create product! See logs`);
        await this.ratingRepo.create({ rate: rating, productId: newProduct.id });
        if (info && info !== 'undefined' && info !== 'null') {
          await this.productInfoRepo.bulkCreate(
            JSON.parse(info).map((el: any) => ({
              title: el.title,
              description: el.description,
              productId: newProduct.id,
            }))
          );
        }
        return await this.productRepo.getProductFullData(newProduct.id);
      });
    } catch (error: any) {
      deleteImage(fileName);
      throw error;
    }
  }

  async updateProduct(id: number, values: Record<string, any>) {
    if (!id) throw ApiError.invalid(`Product Id missing`);
    if (!values || Object.keys(values).length === 0) throw ApiError.invalid(`Product values are missing`);
    const { name, price, rating, brandId, typeId, image } = values;
    let info: string | undefined = values.info;
    let fileName = generateImageName(name);
    try {
      return await sequelize.transaction(async () => {
        const product = await this.productRepo.getProductFullData(id);
        if (!product) throw ApiError.notFound('Product not found!');
        // IMAGE
        if (!image || !image.img) throw ApiError.notFound('No Image detected!');
        if (product.img !== image.img['name'] || product.name !== name) {
          deleteImage(product.img);
          await saveImage(image.img, fileName);
        } else {
          fileName = product.img;
        }
        // INFO
        if (JSON.stringify(product.info) !== info) {
          if (product.info) await this.productInfoRepo.deleteByOptions({ where: { productId: product.id } });
          if (info && info !== 'undefined' && info !== 'null')
            await this.productInfoRepo.bulkCreate(
              JSON.parse(info).map((el: any) => ({
                title: el.title,
                description: el.description,
                productId: product.id,
              }))
            );
        }
        // RATING
        if (rating !== product.rating) {
          await this.ratingRepo.deleteByOptions({ where: { productId: product.id } });
          await this.ratingRepo.create({ rate: rating, productId: product.id });
        }
        await this.productRepo.update(product, { name, price, rating: 5, brandId, typeId, img: fileName }); // product will be with updated data
        return this.productRepo.getProductFullData(product.id);
      });
    } catch (error: any) {
      throw error;
    }
  }

  async findAndCountAllProduct(
    brandId: number | undefined,
    typeId: number | undefined,
    sort: string[],
    v: string | undefined,
    page: number,
    limit: number
  ) {
    if (!page || !limit) throw ApiError.invalid('page, limit params are reqired');
    const condition: any = { where: {} };
    let offset = page * limit - limit; // get from number
    if (v) condition.where.name = { [Op.iLike]: '%' + v + '%' };
    if (brandId) condition.where.brandId = brandId;
    if (typeId) condition.where.typeId = typeId;
    // @ts-ignore
    if (sort[0] === 'rating') sort = [sequelize.literal('rating'), sort[1]];
    return await this.productRepo.findAndCountAll(condition, limit, offset, sort);
  }

  async getAllProduct(options?: FindOptions) {
    return await this.productRepo.getAll(options);
  }

  async deleteProductById(id: number) {
    if (!id) throw ApiError.invalid(`Can't get product Id`);
    const product = await this.productRepo.getById(id);
    if (!product) throw ApiError.notFound(`Can't fing product!`);
    if (product.img) deleteImage(product.img);
    return this.productRepo.deleteByOptions({ where: { id } });
  }
}
