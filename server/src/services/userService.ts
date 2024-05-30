import { FindOptions, GroupedCountResultItem, Op } from 'sequelize';
import { UserInterface } from '../database/models/models';
import UserRepository, { UserRepositoryInterface } from '../repositories/userRepo';
import sequelize from '../database/connect';
import ApiError from '../errors/apiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BasketService, { BasketServiceInterface } from './basketService';

const createJWToken = async (params: any) => {
  // @ts-ignore
  return jwt.sign(params, process.env.SECRET_KEY, { expiresIn: '24h' });
};

export interface UserServiceInterface {
  getAll(): Promise<UserInterface[]>;
  getById(id: number): Promise<UserInterface | null>;
  registration(email: string, password: string): Promise<any>;
  update(id: number, values: Record<string, any>): Promise<UserInterface>;
  delete(id: number): Promise<number>;
  create(email: string, password: string, role?: string): Promise<any>;
  login(email: string, password: string): Promise<any>;
  getMontlyUserRegs(startDate?: Date, endDate?: Date): Promise<GroupedCountResultItem[]>;
}

export default class UserService implements UserServiceInterface {
  private readonly userRepository: UserRepositoryInterface;
  private readonly basketService: BasketServiceInterface;
  constructor() {
    this.userRepository = new UserRepository();
    this.basketService = new BasketService();
  }
  async getAll() {
    return await this.userRepository.getAll({
      attributes: ['id', 'role', 'email', 'createdAt'],
      order: [['id', 'DESC']],
    });
  }
  async getById(id: number) {
    if (!id) throw ApiError.invalid('UresId required');
    return await this.userRepository.getById(id);
  }

  async registration(email: string, password: string) {
    if (!email || !password) throw ApiError.invalid('email, passwors are required');
    if (await this.userRepository.findByOptions({ where: { email } }))
      return ApiError.notFound('This email is already used!');
    const newUser = await this.userRepository.create({
      email,
      role: 'USER',
      password: await bcrypt.hash(String(password), 4),
    });
    if (!newUser) return ApiError.internal(`Sorry! Can't create new user!`);
    await this.basketService.createBasket(newUser.id);
    return await createJWToken({
      id: newUser.id,
      email,
      role: newUser.role,
    });
  }

  async create(email: string, password: string, role?: string) {
    if (!email || !password) throw ApiError.invalid('Email or password is empty!');
    const candidat = await this.userRepository.findByOptions({ where: { email } });
    if (candidat) {
      throw ApiError.internal('This email is already used!');
    }
    const newUser = await this.userRepository.create({
      email,
      role: role || 'USER',
      password: await bcrypt.hash(String(password), 4),
    });
    if (!newUser) throw ApiError.internal(`Sorry! Can't create new user!`);
    await this.basketService.createBasket(newUser.id);
    return newUser;
  }

  async getMontlyUserRegs(startDate?: Date, endDate?: Date) {
    const condition: any = { where: {} };
    if (startDate && endDate) condition.where.createdAt = { [Op.between]: [startDate, endDate] };
    condition.attributes = [[sequelize.literal(`extract(month from "createdAt")`), 'month']];
    const result = await this.userRepository.count({ ...condition, group: ['month'] });
    return result;
  }

  async delete(id: number) {
    if (!id) throw ApiError.invalid('Id is required');
    return await this.userRepository.delete(id);
  }
  async update(id: number, values: Record<string, any>) {
    if (!id) throw ApiError.invalid('Id is required');
    if (!values || Object.keys(values).length === 0) throw ApiError.invalid('values is required');
    if (values.password === '') {
      delete values.password;
    } else {
      values.password = await bcrypt.hash(String(values.password), 4);
    }
    if (values.email) {
      const candidat = await this.userRepository.findByOptions({ where: { email: values.email } });
      if (candidat && candidat.id != id) throw ApiError.invalid('This email is already used!');
    }
    return await this.userRepository.update(id, values);
  }
  async login(email: string, password: string) {
    if (!email || !password) throw ApiError.invalid('Email and password are required!');
    const candidat = await this.userRepository.findByOptions({ where: { email } });
    if (!candidat) throw ApiError.invalid('Email or password incorrect!');

    if (!bcrypt.compareSync(String(password), candidat.password))
      throw ApiError.internal('Email or password is incorrect!');
    return await createJWToken({
      id: candidat.id,
      email,
      role: candidat.role,
    });
  }
}
