import supertest from 'supertest';
import { createServer } from '../../server';
import OrderRepository from '../../repositories/orderRepo';
import jwt from 'jsonwebtoken';
import { userAdminFixt, userFixt } from '../__fixtures__/users';
import {
  newOrderFixt,
  newOrderReceivedParams,
  orderCountByStatusFixt,
  orderFixt,
  orderStatisticAOVFixt,
  orderStatisticBestSellersFixt,
  orderStatisticByStatusFixt,
  orderStatisticCountByStatusFixt,
  orderStatisticMonthlySalesFixt,
  orderUpdatedFixt,
} from '../__fixtures__/orders';
import BasketRepository from '../../repositories/basketRepo';
import ProductRepository from '../../repositories/productRepo';
import { NewOrderGetAllProductsFixt, newOrderGetBasketFixt } from '../__fixtures__/orders';
import BasketProductRepository from '../../repositories/basketProductRepo';
import sequelize from '../../database/connect';

jest.mock('../../repositories/orderRepo');

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });
const userToken = jwt.sign(userFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

const getAll = jest.fn();
const getById = jest.fn();
const create = jest.fn();
const update = jest.fn();
const deleteFn = jest.fn();
const getByOptions = jest.fn();
const count = jest.fn();
//@ts-ignore
OrderRepository.mockImplementation(() => {
  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteFn,
    getByOptions,
    count,
  };
});

const getBasket = jest.fn();

jest.mock('../../repositories/basketRepo');
//@ts-ignore
BasketRepository.mockImplementation(() => {
  return {
    getOneByOptions: getBasket,
    deleteByOptions: deleteByOptionsBasket,
  };
});

jest.mock('../../repositories/basketProductRepo');
const deleteByOptionsBasket = jest.fn();
//@ts-ignore
BasketProductRepository.mockImplementation(() => {
  return {
    deleteByOptions: deleteByOptionsBasket,
  };
});

const getAllProducts = jest.fn();
jest.mock('../../repositories/productRepo');
//@ts-ignore
ProductRepository.mockImplementation(() => {
  return {
    getAll: getAllProducts,
  };
});

beforeEach(() => {
  // @ts-ignore
  OrderRepository.mockClear();
  getAll.mockClear();
  getById.mockClear();
  create.mockClear();
  update.mockClear();
  deleteFn.mockClear();
  getByOptions.mockClear();
  count.mockClear();
});

describe('API / ORDERS POSITIVE', () => {
  getAll.mockImplementation(async () => [orderFixt, orderFixt]);
  getById.mockImplementation(async () => orderFixt);
  update.mockImplementation(async () => orderUpdatedFixt);
  getByOptions.mockImplementation(async () => orderFixt);

  test('GET - /order => list of orders', async () => {
    await supertest(createServer())
      .get('/api/order')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(2);
      });
  });
  test('GET - /order/user => user orders', async () => {
    await supertest(createServer())
      .get('/api/order/user')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(2);
      });
  });
  test('PATCH - /order/update/2  => updated order', async () => {
    await supertest(createServer())
      .patch('/api/order/update/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ values: { status: 'cancelled' } })
      .expect(200)
      .then((result) => {
        expect(result.body.status).toBe('cancelled');
      });
  });
  test('POST - /order/cancel => cancelled order by user', async () => {
    await supertest(createServer())
      .post('/api/order/cancel')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .send({ id: 1 })
      .expect(200)
      .then((result) => {
        expect(result.body.status).toBe('cancelled');
        expect(result.body.userId).toBe(userFixt.id);
      });
  });
  test('POST - /order/new  => created order id:1', async () => {
    getBasket.mockImplementation(async () => newOrderGetBasketFixt);
    getAllProducts.mockImplementation(async () => NewOrderGetAllProductsFixt);
    create.mockImplementation(async () => newOrderFixt);
    deleteByOptionsBasket.mockImplementation(async () => 1);
    //@ts-ignore
    const spyTransaction = jest.spyOn(sequelize, 'transaction').mockImplementation((callback) => callback());
    await supertest(createServer())
      .post('/api/order/new')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .send(newOrderReceivedParams)
      .expect(200)
      .then((result) => {
        expect(result.body.orderId).toBe(1);
      });
    expect(spyTransaction).toHaveBeenCalled();
  });
  test('POST - /statistic/by_status => orders by status', async () => {
    const startDate = new Date();
    await supertest(createServer())
      .post('/api/order/statistic/by_status')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({
        startDate: new Date(startDate.setDate(startDate.getDate() - 3)),
        endDate: new Date(),
      })
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(orderStatisticByStatusFixt);
      });
  });
  test('POST - /statistic/aov => AOV for last 6 month', async () => {
    const startDate = new Date();
    await supertest(createServer())
      .post('/api/order/statistic/aov')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({
        startDate: new Date(startDate.setDate(startDate.getMonth() - 6)),
        endDate: new Date(),
      })
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(orderStatisticAOVFixt);
      });
  });
  test('POST - /statistic/best_sellers => best sellers last 30 days', async () => {
    const startDate = new Date();
    await supertest(createServer())
      .post('/api/order/statistic/best_sellers')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({
        startDate: new Date(startDate.setDate(startDate.getDate() - 30)),
        endDate: new Date(),
      })
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(orderStatisticBestSellersFixt);
      });
  });
  test('POST - /statistic/count_status => number of orders with statuses["new", "released"]', async () => {
    count.mockImplementation(async () => orderCountByStatusFixt);
    await supertest(createServer())
      .post('/api/order/statistic/count_status')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ statuses: ['new', 'released'] })
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(orderStatisticCountByStatusFixt);
      });
  });
  test('POST - /statistic/monthly_sales => monthly sales data', async () => {
    getAll.mockImplementation(() => orderStatisticMonthlySalesFixt);
    const startDate = new Date();
    await supertest(createServer())
      .post('/api/order/statistic/monthly_sales')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({
        startDate: new Date(startDate.setDate(startDate.getMonth() - 1)),
        endDate: new Date(),
      })
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(orderStatisticMonthlySalesFixt);
      });
  });
});

describe('API / TYPES NEGATIVE', () => {
  //   test('GET - /type/222 NO FOUND', async () => {
  //     getById.mockImplementation(async () => null);
  //     await supertest(createServer()).get('/api/type/222').expect(404);
  //   });
  test('GET - /order  returns ERROR: Unauthorized', async () => {
    await supertest(createServer())
      .get('/api/order')
      .expect(401)
      .then((result) => {
        expect(result.body.message).toBe('Unauthorized');
      });
  });
  test('PATCH - /order/update/2  returns ERROR: No permission!', async () => {
    await supertest(createServer())
      .patch('/api/order/update/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .send({ values: { status: 'cancelled' } })
      .expect(483)
      .then((result) => {
        expect(result.body.message).toBe('No permission!');
      });
  });
});
