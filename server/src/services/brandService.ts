import { FindOptions, Optional } from 'sequelize';
import BrandRepository, { BrandRepoInterface } from '../repositories/brandRepo';
import { BrandInterface } from '../database/models/models';
import TypeService from './typeService';

export interface BrandServiceInterface {
  getAllBrands(options?: FindOptions): Promise<BrandInterface[]>;
  createBrand(name: string, brands: number[]): Promise<BrandInterface>;
  updateBrand(id: number, values: Record<string, any>): Promise<BrandInterface | null>;
  deleteBrand(id: number): Promise<BrandInterface | number>;
}

export default class BrandService implements BrandServiceInterface {
  private readonly brandRepo: BrandRepoInterface;

  constructor() {
    this.brandRepo = new BrandRepository();
  }

  async getAllBrands(options?: FindOptions) {
    return await this.brandRepo.getAll(options);
  }
  async createBrand(name: string, types: number[]) {
    const brand = await this.brandRepo.create({ name });
    if (brand && types && types.length > 0) {
      const _types = await new TypeService().getAllTypes({ where: { id: types } });
      //@ts-ignore
      await brand.addTypes(_types);
      //@ts-ignore
      brand.setDataValue('types', _types);
    }
    return brand;
  }
  async updateBrand(id: number, values: Record<string, any>) {
    // console.log('[SERVICE updateType] called!');
    let brand = await this.brandRepo.getById(id);
    if (brand) {
      brand = await this.brandRepo.update(brand, { name: values.name });
      if (values.brands) {
        const _types = await new TypeService().getAllTypes({ where: { id: values.brands } });
        //@ts-ignore
        await brand.setTypes(_types);
        //@ts-ignore
        brand.setDataValue('types', _types);
      }
    }
    return brand;
  }
  async deleteBrand(id: number) {
    return await this.brandRepo.delete(id);
  }
}
