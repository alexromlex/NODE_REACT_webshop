/**
 * @group release_3
 * @group regression
 * @group api
 * @group slow
 * @group basket
 */
import supertest from 'supertest';
import { createApp } from '../../server';
import jwt from 'jsonwebtoken';
import { userFixt } from '../__fixtures__/users';
import { basketTempFixt, basketUserFixt } from '../__fixtures__/basket';
import { productFixt } from '../__fixtures__/product';
import { basketProductFixt } from '../__fixtures__/basketProduct';

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const userToken = jwt.sign(userFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

const basket_create = jest.fn(),
  basket_getOneByOptions = jest.fn(),
  basket_deleteByOptions = jest.fn();

jest.mock('../../repositories/basketRepo', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    create: basket_create,
    getOneByOptions: basket_getOneByOptions,
    deleteByOptions: basket_deleteByOptions,
  }))
}));

const basketProduct_getAll = jest.fn(),
  basketProduct_bulkCreate = jest.fn(),
  basketProduct_deleteByOptions = jest.fn();

jest.mock('../../repositories/basketProductRepo',  () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getAll: basketProduct_getAll,
    bulkCreate: basketProduct_bulkCreate,
    deleteByOptions: basketProduct_deleteByOptions,
  }))
}));

const product_getAll = jest.fn();

jest.mock('../../repositories/productRepo', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getAll: product_getAll,
  }))
}));

beforeEach(() => {
  basket_create.mockClear();
  basket_getOneByOptions.mockClear();
  basket_deleteByOptions.mockClear();
  basketProduct_getAll.mockClear();
  basketProduct_bulkCreate.mockClear();
  basketProduct_deleteByOptions.mockClear();
  product_getAll.mockClear();
});

describe('API / BASKET POSITIVE', () => {
  basket_getOneByOptions.mockImplementation(async () => basketUserFixt);
  basketProduct_getAll.mockImplementation(async () => []);

  test('POST - /basket => Unauthorised user, empty basket, basket id in cookie', async () => {
    await supertest(createApp())
      .post('/api/basket')
      .set('Cookie', 'bsktId=20')
      //   .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(200)
      .then((result) => {
        expect(result.request.getHeader('Cookie')).toBe('bsktId=20');
        expect(result.body).toEqual({ counts: {}, products: [] });
      });
  });
  test('POST - /basket => Authorised user, Not empty basket, basket id in cookie', async () => {
    basketProduct_getAll.mockImplementation(async () => [{ productId: 1 }]);
    product_getAll.mockImplementation(async () => [productFixt]);
    await supertest(createApp())
      .post('/api/basket')
      .set('Cookie', 'bsktId=20')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(200)
      .then((result) => {
        expect(result.body.counts).toEqual({ '1': 1 });
        expect(result.body.products.length).toBe(1);
      });
  });
  test('POST - /basket/add => number of added products', async () => {
    basketProduct_bulkCreate.mockImplementation(async () => [basketProductFixt, basketProductFixt]);
    await supertest(createApp())
      .post('/api/basket/add')
      .set('Cookie', 'bsktId=20')
      .send({ product_id: 1, quantity: 2 })
      .expect(200)
      .then((result) => {
        // console.log('result: ', result.body);
        expect(result.body.added).toBe(2);
      });
  });
  test('POST - /basket/delete', async () => {
    basketProduct_getAll.mockImplementation(async () => [basketProductFixt]);
    basketProduct_deleteByOptions.mockImplementation(async () => 1);
    await supertest(createApp())
      .post('/api/basket/delete')
      .set('Cookie', 'bsktId=20')
      .send({ product_id: 1, quantity: 1 })
      .expect(200)
      .then((result) => {
        // console.log('result: ', result.body);
        expect(result.body).toBe(1);
      });
  });
  test('GET - /basket/empty', async () => {
    basket_deleteByOptions.mockImplementation(async () => 1);
    await supertest(createApp())
      .get('/api/basket/empty')
      .set('Cookie', 'bsktId=20')
      .expect(200)
      .then((result) => {
        expect(result.body.removed).toBe(1);
      });
  });
});

describe('API / BASKET NEGATIVE', () => {
  basket_create.mockImplementation(() => basketTempFixt);
  test('POST - /basket => unauthorised user no basket id in cookie', async () => {
    await supertest(createApp()).post('/api/basket').expect(404);
  });
});
