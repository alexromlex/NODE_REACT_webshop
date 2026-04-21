/**
 * @group release_3
 * @group regression
 * @group order
 * @group api
 */
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
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
  NewOrderGetAllProductsFixt,
  newOrderGetBasketFixt
} from '../__fixtures__/orders';
import { userAdminFixt, userFixt } from '../__fixtures__/users';
import sequelize from '../../database/connect';
import { createApp } from '../../server';

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });
const userToken = jwt.sign(userFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });
const idempotencyKey = uuidv4();

const getBasket = jest.fn();
jest.mock('../../services/basketService', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getBasket,
    emptyBasket: jest.fn(),
  }))
}));

const getAllProduct = jest.fn();
jest.mock('../../services/productService', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getAllProduct
  }))
}));

const mockOrderRepo = {
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  getByOptions: jest.fn(),
  count: jest.fn(),
}

jest.mock('../../repositories/orderRepo', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    create: mockOrderRepo.create,
    getAll: mockOrderRepo.getAll,
    getById: mockOrderRepo.getById,
    update: mockOrderRepo.update,
    getByOptions: mockOrderRepo.getByOptions,
    count: mockOrderRepo.count,
  }))
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(sequelize, 'transaction').mockImplementation(async (callback: any) => callback());
});

describe('API / ORDERS POSITIVE', () => {
  mockOrderRepo.getAll.mockResolvedValue([orderFixt, orderFixt]);
  mockOrderRepo.getById.mockResolvedValue(orderFixt);
  mockOrderRepo.update.mockResolvedValue(orderUpdatedFixt);
  mockOrderRepo.getByOptions.mockResolvedValue(orderFixt);

  test('GET - /order => list of orders', async () => {
    await supertest(createApp())
      .get('/api/order')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(2);
      });
  });

  test('GET - /order/user => user orders', async () => {
    await supertest(createApp())
      .get('/api/order/user')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(2);
      });
  });

  test('PATCH - /order/update/2  => updated order', async () => {
    await supertest(createApp())
      .patch('/api/order/update/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ values: { status: 'cancelled' } })
      .expect(200)
      .then((result) => {
        expect(result.body.status).toBe('cancelled');
      });
  });

  test('POST - /order/cancel => cancelled order by user', async () => {
    await supertest(createApp())
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
    getBasket.mockResolvedValue(newOrderGetBasketFixt);
    getAllProduct.mockResolvedValue(NewOrderGetAllProductsFixt);
    mockOrderRepo.create.mockResolvedValue(newOrderFixt);
    await supertest(createApp())
      .post('/api/order/new')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .set('Idempotency-Key', idempotencyKey)
      .send(newOrderReceivedParams)
      .expect(200)
      .then((result) => {
        expect(result.body.orderId).toBe(1);
      });

      

  });

  test('POST - /statistic/by_status => orders by status', async () => {
    const startDate = new Date();
    await supertest(createApp())
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
    await supertest(createApp())
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
    await supertest(createApp())
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
    mockOrderRepo.count.mockResolvedValue(orderCountByStatusFixt);
    await supertest(createApp())
      .post('/api/order/statistic/count_status')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ statuses: ['new', 'released'] })
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(orderStatisticCountByStatusFixt);
      });
  });

  test('POST - /statistic/monthly_sales => monthly sales data', async () => {
    mockOrderRepo.getAll.mockResolvedValue(orderStatisticMonthlySalesFixt);
    const startDate = new Date();
    await supertest(createApp())
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

describe('API / ORDERS NEGATIVE', () => {
  test('GET - /order  Unauthorized => 401', async () => {
    await supertest(createApp())
      .get('/api/order')
      .expect(401)
      .then((result) => {
        expect(result.body.message).toBe('Unauthorized');
      });
  });
  
  test('PATCH - /order/update/2  No permission => 403', async () => {
    await supertest(createApp())
      .patch('/api/order/update/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .send({ values: { status: 'cancelled' } })
      .expect(403)
      .then((result) => {
        expect(result.body.message).toBe('No permission!');
      });
  });

  test('POST - /order/new  NO Idempotency Key => 400', async () => {
    await supertest(createApp())
      .post('/api/order/new')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      // .set('Idempotency-Key', idempotencyKey)
      .send(newOrderReceivedParams)
      .expect(400)
  });

  test('POST - /order/new SAME Idempotency Key', async () => {
    getBasket.mockResolvedValue(newOrderGetBasketFixt);
    getAllProduct.mockResolvedValue(NewOrderGetAllProductsFixt);
    mockOrderRepo.create.mockResolvedValue({...newOrderFixt, id: 2});
    await supertest(createApp())
      .post('/api/order/new')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .set('Idempotency-Key', idempotencyKey)
      .send(newOrderReceivedParams)
      .expect(200)
      .then((result) => {
        expect(result.body.orderId).toBe(1);
      });
  });
});

