import supertest from 'supertest';
import { createServer } from '../../server';
import BrandRepository from '../../repositories/brandRepo';
import { brandFixt, brandNewFixt, brandUpdatedFixt, brandsFixt } from '../__fixtures__/brands';
import jwt from 'jsonwebtoken';
import { typesFixt } from '../__fixtures__/types';
import { userAdminFixt } from '../__fixtures__/users';

jest.mock('../../repositories/brandRepo');

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

const getAll = jest.fn();
const getById = jest.fn();
const create = jest.fn();
const update = jest.fn();
const deleteFn = jest.fn();

//@ts-ignore
BrandRepository.mockImplementation(() => {
  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteFn,
  };
});

beforeEach(() => {
  // @ts-ignore
  BrandRepository.mockClear();
  getAll.mockClear();
  getById.mockClear();
  create.mockClear();
  update.mockClear();
  deleteFn.mockClear();
});

describe('API / BRANDS POSITIVE', () => {
  getAll.mockImplementation(async () => brandsFixt);
  getById.mockImplementation(async () => brandFixt);
  create.mockImplementation(async () => brandNewFixt);
  update.mockImplementation(async () => brandUpdatedFixt);
  deleteFn.mockImplementation(async () => null);

  test('GET - /brand returns list of brands', async () => {
    await supertest(createServer())
      .get('/api/brand')
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(2);
      });
  });
  test('POST - /brand  returns created brand id:99', async () => {
    await supertest(createServer())
      .post('/api/brand/')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ name: 'new brand' })
      .expect(200)
      .then((result) => {
        expect(result.body.id).toBe(99);
        expect(result.body.types.length).toBe(typesFixt.length);
      });
  });
  test('PATCH - /brand/99 returns updated brand', async () => {
    getById.mockImplementation(async () => brandFixt);
    await supertest(createServer())
      .patch('/api/brand/99')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ name: 'updated new brand' })
      .expect(200)
      .then((result) => {
        expect(result.body.name).toBe('updated new brand');
      });
  });
  test('DELETE - /brand/99 returns 200 when delete brand', async () => {
    await supertest(createServer())
      .delete('/api/brand/99')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200);
  });
});

describe('API / BRANDS NEGATIVE', () => {
  test('GET - /brand/333 NO FOUND', async () => {
    getById.mockImplementation(async () => null);
    await supertest(createServer()).get('/api/brand/333').expect(404);
  });
  test('POST - /brand  returns ERROR Unauthorized', async () => {
    await supertest(createServer())
      .post('/api/brand/')
      .send({ name: 'new brand' })
      .expect(401)
      .then((result) => {
        expect(result.body.message).toBe('Unauthorized');
      });
  });
});
