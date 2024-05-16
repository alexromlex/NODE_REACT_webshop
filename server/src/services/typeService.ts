import { FindOptions, Optional } from 'sequelize';
import TypeRepository, { TypeRepoInterface } from '../repositories/typeRepo';
import { TypeInterface } from '../database/models/models';
import BrandService from './brandService';
import ApiError from '../errors/apiError';

export interface TypeServiceInterface {
  getAllTypes(): Promise<TypeInterface[]>;
  getOneType(id: number): Promise<TypeInterface | null>;
  createType(name: string, brands: number[]): Promise<TypeInterface | ApiError>;
  updateType(id: number, values: Record<string, any>): Promise<TypeInterface | null>;
  deleteType(id: number): Promise<TypeInterface | number>;
}

export default class TypeService implements TypeServiceInterface {
  private readonly typeRepo: TypeRepoInterface;

  constructor() {
    this.typeRepo = new TypeRepository();
  }

  async getAllTypes(options?: FindOptions) {
    return await this.typeRepo.getAll(options);
  }
  async getOneType(id: number) {
    return await this.typeRepo.getById(id);
  }
  async createType(name: string, brands: number[]) {
    try {
      const type = await this.typeRepo.create({ name });
      if (type && brands && brands.length > 0) {
        const _brands = await new BrandService().getAllBrands({ where: { id: brands }, include: undefined });
        //@ts-ignore
        await type.addBrands(_brands);
        //@ts-ignore
        type.setDataValue('brands', _brands);
      }
      return type;
    } catch (error: any) {
      if (error.errors) throw ApiError.internal(error.errors.map((e: any) => e.message).join(', '));
      throw ApiError.internal(error);
    }
  }
  async updateType(id: number, values: Record<string, any>) {
    // console.log('[SERVICE updateType] called!');
    let type = await this.typeRepo.getById(id);
    if (type) {
      type = await this.typeRepo.update(type, { name: values.name });
      if (values.brands) {
        const _brands = await new BrandService().getAllBrands({ where: { id: values.brands } });
        //@ts-ignore
        await type.setBrands(_brands);
        //@ts-ignore
        type.setDataValue('brands', _brands);
      }
    }
    return type;
  }
  async deleteType(id: number) {
    return await this.typeRepo.delete(id);
  }
}
