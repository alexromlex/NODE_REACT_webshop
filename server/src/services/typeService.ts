import { FindOptions } from 'sequelize';
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

class TypeService implements TypeServiceInterface {
  //@ts-ignore
  private readonly typeRepo: TypeRepository;

  //@ts-ignore
  constructor(typeRepo: TypeRepository) {
    this.typeRepo = typeRepo;
  }

  public async getAllTypes(options?: FindOptions) {
    return await this.typeRepo.getAll(options);
  }
  public async getOneType(id: number) {
    if (!id) throw ApiError.invalid('Type Id is required');
    return await this.typeRepo.getById(id);
  }
  public async createType(name: string, brands: number[]) {
    if (!name) throw ApiError.invalid('Type name is required');
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
  public async updateType(id: number, values: Record<string, any>) {
    if (!id) throw ApiError.invalid('Type Id is required');
    if (!values || Object.keys(values).length === 0) throw ApiError.invalid('values are required');
    let type = await this.typeRepo.getById(id);
    if (!type) throw ApiError.notFound('Type not found');
    type = await this.typeRepo.update(type, { name: values.name });
    if (values.brands) {
      const _brands = await new BrandService().getAllBrands({ where: { id: values.brands } });
      //@ts-ignore
      await type.setBrands(_brands);
      //@ts-ignore
      type.setDataValue('brands', _brands);
    }

    return type;
  }
  public async deleteType(id: number) {
    return await this.typeRepo.delete(id);
  }
}
export default new TypeService(TypeRepository);
