import sequelize from '../database/connect';
import ApiError from '../errors/apiError';
import { NextFunction, Request, Response } from 'express';
import { ModelStatic } from 'sequelize';

export default class BaseController {
  model: ModelStatic<any>;
  constructor(model: ModelStatic<any>) {
    this.model = model;
  }

  static sync() {
    sequelize
      .sync({ alter: true })
      .then(() => console.log('#################################### SYNC ###################################'))
      .catch((e) => {
        console.log('###################  SYNC ERROR: ', e);
      });
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // console.log(`>>>>> [create] called - ${this.model.name}`);
    const data = req.body;
    try {
      const result = await this.model.create(data);
      return res.status(200).json(result);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    console.log(`>>>>> [getAll] called - ${this.model.name}`);
    try {
      const result = await this.model.findAll({ order: [['id', 'DESC']] });
      // console.log('RESULT: ', JSON.stringify(result, null, 2));
      return res.status(200).json(result);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    // console.log(`>>>>> [delete] called - ${this.model.name}`);
    const { id } = req.params;
    try {
      const finded = await this.model.findOne({ where: { id: id } });
      if (!finded) return next(ApiError.notFound('Not found!'));
      const result = await finded.destroy();
      return res.status(200).json(result);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    // console.log(`>>>>> [update] called - ${this.model.name}`);
    const { id } = req.params;
    const data = req.body;
    try {
      const result = await this.model.update(data, { where: { id: id } });
      return res.status(200).json(result);
    } catch (error) {
      return next(ApiError.invalid(error));
    }
  }
}
