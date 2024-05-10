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
  registration(values: { email: string; password: string }): Promise<any>;
  findByOptions(options: FindOptions): Promise<UserInterface | null>;
  update(id: number, values: Record<string, any>): Promise<UserInterface>;
  delete(id: number): Promise<number>;
  create(values: { email: string; password: string; role: string }): Promise<any>;
  login(email: string, password: string): Promise<any>;
  getMontlyUserRegs(confing: Record<string, any>): Promise<GroupedCountResultItem[]>;
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
    return await this.userRepository.getById(id);
  }

  async registration(values: { email: string; password: string }) {
    const candidat = await this.userRepository.findByOptions({ where: { email: values.email } });
    if (candidat) return ApiError.notFound('This email is already used!');
    const hashPassword = await bcrypt.hash(String(values.password), 4);
    const newUser = await this.userRepository.create({ email: values.email, role: 'USER', password: hashPassword });
    if (!newUser) return ApiError.internal(`Sorry! Can't create new user!`);
    await this.basketService.create({ userId: newUser.id });
    const token = await createJWToken({
      id: newUser.id,
      email: values.email,
      role: newUser.role,
    });
    return token;
  }

  async create(values: { email: string; password: string; role: string }) {
    if (!values.email || !values.password) {
      throw ApiError.invalid('Email or password empty!');
    }
    if (!values.role) values.role = 'USER';
    const candidat = await this.userRepository.findByOptions({ where: { email: values.email } });
    if (candidat) {
      throw ApiError.internal('This email is already used!');
    }
    const hashPassword = await bcrypt.hash(String(values.password), 4);
    const newUser = await this.userRepository.create({
      email: values.email,
      role: values.role,
      password: hashPassword,
    });
    if (!newUser) throw ApiError.internal(`Sorry! Can't create new user!`);
    await this.basketService.create({ userId: newUser.id });
    return newUser;
  }

  async getMontlyUserRegs(confing: Record<string, any>) {
    const condition: any = { where: {} };
    if (confing.startDate && confing.endDate)
      condition.where.createdAt = { [Op.between]: [confing.startDate, confing.endDate] };
    condition.attributes = [[sequelize.literal(`extract(month from "createdAt")`), 'month']];
    const result = await this.userRepository.count({ ...condition, group: ['month'] });
    return result;
  }
  async findByOptions(values: Record<string, any>) {
    return await this.userRepository.findByOptions({ where: { ...values } });
  }
  //   async update() {}
  async delete(id: number) {
    if (!id) throw ApiError.invalid('Data is missing!');
    return await this.userRepository.delete(id);
  }
  async update(id: number, values: Record<string, any>) {
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
    if (!email || !password) throw ApiError.invalid('Email or password not found!');
    const candidat = await this.userRepository.findByOptions({ where: { email } });
    if (!candidat) throw ApiError.invalid('Email or password incorrect!');

    if (!bcrypt.compareSync(String(password), candidat.password))
      throw ApiError.internal('Email or password incorrect!');
    return await createJWToken({
      id: candidat.id,
      email,
      role: candidat.role,
    });
  }
}
