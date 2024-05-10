import { BulkCreateOptions, FindOptions, Op } from 'sequelize';
import BasketRepository, { BasketRepoInterface } from '../repositories/basketRepo';
import { BasketInterface, BasketProductInterface, ProductInterface } from '../database/models/models';
import BasketProductRepository, { BasketProductRepoInterface } from '../repositories/basketProductRepo';
import ProductService, { ProductServiceInterface } from './productService';
import BasketProductService, { BasketProductServiceInterface } from './basketProductService';

export interface BasketServiceInterface {
  getBasket(options?: FindOptions): Promise<BasketInterface | null>;
  deleteProductFromBasketByOptions(options: FindOptions): Promise<number>;
  create(values: Record<string, any>): Promise<BasketInterface>;
  getBasketProducts(values: Record<string, any>): Promise<any>;
  addToBasket(records: Record<string, any>[], options?: BulkCreateOptions): Promise<BasketProductInterface[]>;
  deleteFromBasket(values: Record<string, any>): Promise<number>;
  emptyBasket(id: number): Promise<number>;
}

export default class BasketService implements BasketServiceInterface {
  private readonly basketRepo: BasketRepoInterface;
  private readonly basketProductRepo: BasketProductRepoInterface;
  private readonly basketProductService: BasketProductServiceInterface;
  private readonly productService: ProductServiceInterface;
  name: string;
  constructor() {
    this.basketRepo = new BasketRepository();
    this.basketProductRepo = new BasketProductRepository();
    this.basketProductService = new BasketProductService();
    this.productService = new ProductService();
    this.name = 'BasketService';
  }

  async create(values: Record<string, any>) {
    return await this.basketRepo.create(values);
  }

  async getBasketProducts(values: Record<string, any>) {
    // console.log(`[${this.name} getBasketProducts] called!`);
    if (values.user_id) {
      const userBasket = await this.basketRepo.getOneByOptions({ where: { userId: values.user_id } });
      if (userBasket) {
        if (values.basketCookieId && userBasket.id != values.basketCookieId) {
          await this.basketProductRepo.updateByOptions(
            { basketId: userBasket.id },
            { where: { basketId: values.basketCookieId } }
          );
          // delete temp basket
          await this.basketRepo.deleteByOptions({ where: { id: values.basketCookieId } });
        }
        values.basketCookieId = userBasket.id;
      }
    }
    if (values.product_id && values.basketCookieId) {
      const basketProduct = await this.basketProductRepo.create({
        basketId: values.user_id,
        productId: values.product_id,
      });
      // console.log('basketProduct: ', JSON.stringify(basketProduct, null, 2));
    }

    const basketAllProduct = await this.basketProductRepo.getAll({
      attributes: ['productId'],
      where: { basketId: values.basketCookieId },
    });
    // console.log('basketAllProduct: ', JSON.stringify(basketAllProduct, null, 2));

    const result = { counts: {}, products: [] },
      productIdList: number[] = [];
    if (basketAllProduct.length === 0) return result;

    basketAllProduct.forEach(async (el: any) => {
      productIdList.push(el.productId);
      result.counts[el.productId] = result.counts[el.productId] ? result.counts[el.productId] + 1 : 1;
    });
    result.products = await this.productService.getAllProduct({ where: { id: { [Op.in]: productIdList } } });
    // console.log('products: ', JSON.stringify(result.products, null, 2));

    return result;
  }
  async getBasket(options: FindOptions) {
    return await this.basketRepo.getOneByOptions(options);
  }

  async deleteProductFromBasketByOptions(options: FindOptions) {
    return await this.basketProductRepo.deleteByOptions(options);
  }

  async emptyBasket(id: number) {
    return await this.basketProductRepo.deleteByOptions({ where: { basketId: id } });
  }

  async deleteFromBasket(values: Record<string, any>) {
    const basketProducts = await this.basketProductService.getAll({
      where: { basketId: values.basketId, productId: values.product_id },
    });
    // console.log('basketProducts: ', JSON.stringify(basketProducts, null, 2));
    let condition: any = { productId: values.product_id, basketId: Number(values.basketId) };
    if (basketProducts.length > Number(values.quantity)) {
      condition = { id: { [Op.in]: basketProducts.splice(0, values.quantity).map((el) => el.id) } };
      // console.log('condition: ', condition);
    }
    return await this.basketProductRepo.deleteByOptions({ where: condition });
  }

  async addToBasket(records: Record<string, any>[], options: BulkCreateOptions = {}) {
    return await this.basketProductService.bulkCreate(records, options);
  }
}
