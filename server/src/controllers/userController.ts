import ApiError from '../errors/apiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Basket } from '../database/models/models';
import { NextFunction, Request, Response } from 'express';
import UserService, { UserServiceInterface } from '../services/userService';

const createJWToken = async (params: any) => {
  // @ts-ignore
  return jwt.sign(params, process.env.SECRET_KEY, { expiresIn: '24h' });
};

export default class UserController {
  model: any;
  name: string;

  private readonly userService: UserServiceInterface;
  constructor() {
    this.userService = new UserService();
    this.model = User;
    this.name = 'UserController';
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>>>>>>>> getAll');
    try {
      const users = await this.userService.getAll();
      return res.status(200).json(users);
    } catch (error: any) {
      return next(ApiError.invalid(error));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>>>>>>>> getOne');
    const { id } = req.params;
    if (!id) return next(ApiError.notFound('User Id not provided!'));
    try {
      const user = await this.userService.getById(Number(id));
      if (!user) return next(ApiError.notFound(`User not found!`));
      return res.status(200).json(user);
    } catch (error: any) {
      return next(ApiError.invalid(error));
    }
  }

  async getMontlyUserRegs(req: Request, res: Response, next: NextFunction) {
    // console.log('>>>>>>>>>>>>>>>> [getMontlyUserRegs] called!');
    const { startDate, endDate } = req.body;
    try {
      const result = await this.userService.getMontlyUserRegs({ startDate, endDate });
      if (!result) return next(ApiError.internal(`Can't get statistics. See logs`));
      res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return next(ApiError.invalid(error));
    }
  }

  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.notFound('Email or password incorrect!'));
    }
    try {
      const result = await this.userService.registration({ email, password });
      return res.status(200).json({ token: result });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    let { email, password, role } = req.body;
    try {
      const result = await this.userService.create({ email, password, role });
      return res.status(200).json({ user: result });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body;

    if (!id || !data) return next(ApiError.invalid('Data is missing!'));
    try {
      const user = await this.userService.update(Number(id), data);
      return res.status(200).json(user);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(ApiError.invalid('Data is missing!'));
    try {
      const result = await this.userService.delete(Number(id));
      if (!result) return next(ApiError.internal(`Can't delete user! See logs`));
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) return next(ApiError.invalid('Email or password not found!'));
    try {
      const token = await this.userService.login(email, password);
      if (!token) return next(ApiError.internal(`Can't create token! See logs`));
      return res.status(200).json({ token });
    } catch (error: any) {
      if (error.errors) return next(ApiError.invalid(error.errors.map((e: any) => e.message).join(', ')));
      return next(ApiError.invalid(error.message || error));
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const user = req.user || undefined;
    if (!user) return next(ApiError.notFound(`Can't get user!`));
    const token = await createJWToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.status(200).json({ token });
  }
}
