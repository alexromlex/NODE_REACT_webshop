import { BulkCreateOptions, FindOptions, Op } from 'sequelize';
import BasketRepository, { BasketRepoInterface } from '../repositories/basketRepo';
import { BasketInterface, BasketProductInterface, ProductInterface } from '../database/models/models';
import BasketProductRepository, { BasketProductRepoInterface } from '../repositories/basketProductRepo';
import ProductService, { ProductServiceInterface } from './productService';
import BasketProductService, { BasketProductServiceInterface } from './basketProductService';
import ApiError from '../errors/apiError';

export interface BasketServiceInterface {
  getBasket(id?: number, userId?: number): Promise<BasketInterface | null>;
  createBasket(userId?: number, temp?: boolean): Promise<BasketInterface>;
  getBasketProducts(
    basketId: number,
    user_id?: number | null,
    product_id?: number | null
  ): Promise<{ counts: {}; products: ProductInterface[] }>;
  addToBasket(basketId: number, productId: number, quantity: number): Promise<BasketProductInterface[]>;
  deleteFromBasket(basketId: number, productId: number, quantity: number): Promise<number>;
  emptyBasket(id: number): Promise<number>;
}

export default class BasketService implements BasketServiceInterface {
  private readonly basketRepo: BasketRepoInterface;
  private readonly basketProductRepo: BasketProductRepoInterface;
  private readonly basketProductService: BasketProductServiceInterface;
  private readonly productService: ProductServiceInterface;
  constructor() {
    this.basketRepo = new BasketRepository();
    this.basketProductRepo = new BasketProductRepository();
    this.basketProductService = new BasketProductService();
    this.productService = new ProductService();
  }

  public async createBasket(userId?: number, temp: boolean = true) {
    if (!userId) return await this.basketRepo.create({ temp: true });
    return await this.basketRepo.create({ userId, temp });
  }

  public async getBasketProducts(basketId: number, user_id?: number, product_id?: number) {
    if (!basketId) throw ApiError.notFound('Basket Id not foud!');
    // update user basket from temp to own basket. It usually happens after login
    if (user_id) {
      const userBasket = await this.basketRepo.getOneByOptions({ where: { userId: Number(user_id) } });
      if (userBasket) {
        if (userBasket.id != basketId) {
          await this.basketProductRepo.updateByOptions({ basketId: userBasket.id }, { where: { basketId: basketId } });
          // delete temp basket
          await this.basketRepo.deleteByOptions({ where: { id: basketId } });
        }
        basketId = userBasket.id;
      }
    }
    // create new basketProduct if product_id
    if (product_id) {
      await this.basketProductRepo.create({
        basketId: user_id,
        productId: product_id,
      });
    }
    // get all basketProducts by basketId
    const basketAllProduct = await this.basketProductRepo.getAll({
      attributes: ['productId'],
      where: { basketId },
    });
    // count products in user basket
    const result: { counts: {}; products: ProductInterface[] } = { counts: {}, products: [] },
      productIdList: number[] = [];
    if (basketAllProduct.length === 0) return result;

    basketAllProduct.forEach(async (el: any) => {
      productIdList.push(el.productId);
      result.counts[el.productId] = result.counts[el.productId] ? result.counts[el.productId] + 1 : 1;
    });
    result.products = await this.productService.getAllProduct({ where: { id: { [Op.in]: productIdList } } });
    return result;
  }

  public async getBasket(id?: number, userId?: number) {
    if (!id && !userId) throw ApiError.invalid('basket id or userId is missing');
    return await this.basketRepo.getOneByOptions({ where: id ? { id } : { userId } });
  }

  public async emptyBasket(basketId: number) {
    if (!basketId) throw ApiError.invalid('basketId is required');
    return await this.basketProductRepo.deleteByOptions({ where: { basketId } });
  }

  public async deleteFromBasket(basketId: number, productId: number, quantity: number) {
    if (!basketId || !productId || !quantity)
      throw ApiError.invalid('basketId, product_id and quantity must be provided');
    const basketProducts = await this.basketProductService.getAll({ where: { basketId, productId } });
    let condition: any = { productId, basketId };
    if (basketProducts.length > quantity) {
      condition = { id: { [Op.in]: basketProducts.splice(0, quantity).map((el) => el.id) } };
    }
    return await this.basketProductRepo.deleteByOptions({ where: condition });
  }

  public async addToBasket(basketId: number, productId: number, quantity: number) {
    if (!basketId || !productId || !quantity) throw ApiError.invalid(`Missing required params`);
    return await this.basketProductService.bulkCreate(Array(quantity).fill({ productId, basketId }));
  }
}
