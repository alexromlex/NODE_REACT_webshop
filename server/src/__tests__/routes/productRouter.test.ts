// 'use strict';
import supertest from 'supertest';
import { createServer } from '../../server';
import ProductRepository from '../../repositories/productRepo';
import jwt from 'jsonwebtoken';
import { userAdminFixt } from '../__fixtures__/users';
import { productFixt, productImagePath, productUpdatedFixt } from '../__fixtures__/product';
import RatingRepository from '../../repositories/ratingRepo';
import ProductInfoRepository from '../../repositories/productInfoRepo';
import { productInfoFixt } from '../__fixtures__/productInfo';
import { ratingFixt } from '../__fixtures__/rating';
import { saveImage, deleteImage } from '../../utils';
import sequelize from '../../database/connect';

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

const product_getAll = jest.fn();
const product_findAndCountAll = jest.fn();
const product_create = jest.fn();
const product_getProductFullData = jest.fn();
const product_getById = jest.fn();
const product_deleteByOptions = jest.fn();
const product_update = jest.fn();

jest.mock('../../repositories/productRepo', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAll: product_getAll,
      getById: product_getById,
      findAndCountAll: product_findAndCountAll,
      create: product_create,
      getProductFullData: product_getProductFullData,
      deleteByOptions: product_deleteByOptions,
      update: product_update,
    };
  });
});

const rating_create = jest.fn(),
  rating_deleteByOptions = jest.fn();
jest.mock('../../repositories/ratingRepo', () => {
  return jest.fn().mockImplementation(() => {
    return { create: rating_create, deleteByOptions: rating_deleteByOptions };
  });
});

const productInfo_bulkCreate = jest.fn();
jest.mock('../../repositories/productInfoRepo', () => {
  return jest.fn().mockImplementation(() => {
    return { bulkCreate: productInfo_bulkCreate };
  });
});

jest.mock('../../utils');

beforeEach(() => {
  // @ts-ignore
  ProductRepository.mockClear();
  // @ts-ignore
  RatingRepository.mockClear();
  // @ts-ignore
  ProductInfoRepository.mockClear();
  product_getProductFullData.mockClear();
  product_getAll.mockClear();
  product_findAndCountAll.mockClear();
  product_create.mockClear();
  product_deleteByOptions.mockClear();
  product_getById.mockClear();
  product_update.mockClear();
  rating_create.mockClear();
  rating_deleteByOptions.mockClear();
});

describe('API / PRODUCT POSITIVE', () => {
  test('GET - /product => list of products', async () => {
    product_findAndCountAll.mockImplementation(async () => ({ rows: [productFixt, productFixt], count: 2 }));
    await supertest(createServer())
      .get('/api/product')
      .query({ page: '1', limit: '6', sort: ['updatedAt', 'DESC'] })
      .expect(200)
      .then((result) => {
        expect(result.body.rows.length).toBe(2);
        expect(result.body.count).toBe(2);
      });
  });
  test('POST - /product => new product', async () => {
    product_create.mockImplementation(async () => productFixt);
    rating_create.mockImplementation(async () => ratingFixt);
    productInfo_bulkCreate.mockImplementation(async () => [productInfoFixt, productInfoFixt]);
    product_getProductFullData.mockImplementation(async () => productFixt);
    jest.mocked(saveImage).mockImplementation(() => 'text');
    // @ts-ignore
    const spyTransaction = jest.spyOn(sequelize, 'transaction').mockImplementation((callback) => callback());
    await supertest(createServer())
      .post('/api/product')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .attach('img', productImagePath)
      .field('name', 'NEW PRODUCT NAME')
      .field('price', '150000')
      .field('brandId', '1')
      .field('typeId', '1')
      .field('rating', '4.5')
      .field('info', JSON.stringify([productInfoFixt, productInfoFixt]))
      .expect(200)
      .then((result) => {
        expect(result.body.id).toBe(1);
        expect(result.body.name).toBe('FREEZER 54545885ED');
      });
    expect(spyTransaction).toHaveBeenCalled();
  });
  test('GET - /product/1 => product by id 1', async () => {
    product_getProductFullData.mockImplementation(async () => productFixt);
    await supertest(createServer())
      .get('/api/product/1')
      .expect(200)
      .then((result) => {
        expect(result.body.id).toBe(productFixt.id);
      });
  });
  test('DELETE - /product/1 => deleted product Id:1', async () => {
    product_getById.mockImplementation(async () => productFixt);
    product_deleteByOptions.mockImplementation(async () => 1);
    await supertest(createServer())
      .delete('/api/product/1')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((result) => {
        expect(result.body).toBe(1);
      });
  });
  test('PATCH - /product/1 => updated product with name and image', async () => {
    product_getProductFullData
      .mockImplementationOnce(async () => productFixt)
      .mockImplementationOnce(async () => productUpdatedFixt);
    product_update.mockImplementation(async () => productUpdatedFixt);
    jest.mocked(saveImage).mockImplementation(() => 'text');
    jest.mocked(deleteImage).mockImplementation(() => true);
    rating_create.mockImplementation(async () => ratingFixt);
    rating_deleteByOptions.mockImplementation(async () => 1);
    // @ts-ignore
    const spyTransaction = jest.spyOn(sequelize, 'transaction').mockImplementation((callback) => callback());
    await supertest(createServer())
      .patch('/api/product/1')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .attach('img', productImagePath)
      .field('name', 'UPDATED PRODUCT NAME')
      .field('price', '150000')
      .field('brandId', '1')
      .field('typeId', '1')
      .field('rating', '4.5')
      .field('info', JSON.stringify([productInfoFixt, productInfoFixt]))
      .expect(200)
      .then((result) => {
        expect(result.body.name).toBe('UPDATED PRODUCT NAME');
        expect(result.body.img).toBe('UPDATED_PRODUCT_NAME_image.jpg');
      });
    expect(spyTransaction).toHaveBeenCalled();
  });
});

describe('API / TYPES NEGATIVE', () => {});
