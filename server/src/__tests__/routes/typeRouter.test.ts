/**
 * @group release_2
 * @group regression
 * @group api
 * @group type
 */
import supertest from 'supertest';
import { createApp } from '../../server';
import { typeFixt, typeNewFixt, typeUpdatedFixt, typesFixt } from '../__fixtures__/types';
import jwt from 'jsonwebtoken';
import { brandsFixt } from '../__fixtures__/brands';
import { userAdminFixt } from '../__fixtures__/users';



process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

const getAll = jest.fn(),
  getById = jest.fn(),
  create = jest.fn(),
  update = jest.fn(),
  deleteFn = jest.fn();

jest.mock('../../repositories/typeRepo', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getAll,
    getById,
    create,
    update,
    delete: deleteFn
  }))
}));

const app = createApp();

beforeEach(() => {
  getAll.mockClear();
  getById.mockClear();
  create.mockClear();
  update.mockClear();
  deleteFn.mockClear();
});

describe('API / TYPES POSITIVE', () => {
  getAll.mockImplementation(async () => typesFixt);
  getById.mockImplementation(async () => typeFixt);
  create.mockImplementation(async () => typeNewFixt);
  update.mockImplementation(async () => typeUpdatedFixt);
  deleteFn.mockImplementation(async () => null);

  test('GET - /type returns list of types', async () => {
    await supertest(app)
      .get('/api/type')
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(2);
      });
  });
  test('GET - /type/1 returns type by id', async () => {
    await supertest(app)
      .get('/api/type/1')
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
      });
  });
  test('POST - /type  returns created type id:99', async () => {
    await supertest(app)
      .post('/api/type/')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ name: 'new type' })
      .expect(200)
      .then((result) => {
        expect(result.body.id).toBe(99);
        expect(result.body.brands.length).toBe(brandsFixt.length);
      });
  });
  test('PATCH - /type/99 returns updated type', async () => {
    getById.mockImplementation(async () => typeFixt);
    await supertest(app)
      .patch('/api/type/99')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ name: 'updated new type' })
      .expect(200)
      .then((result) => {
        expect(result.body.name).toBe('updated new type');
      });
  });
  test('DELETE - /type/99 returns 200 when delete type', async () => {
    await supertest(app)
      .delete('/api/type/99')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200);
  });
});

describe('API / TYPES NEGATIVE', () => {
  test('GET - /type/222 NO FOUND', async () => {
    getById.mockImplementation(async () => null);
    await supertest(app).get('/api/type/222').expect(404);
  });
  test('POST - /type  returns ERROR Unauthorized', async () => {
    await supertest(app)
      .post('/api/type/')
      .send({ name: 'new type' })
      .expect(401)
      .then((result) => {
        expect(result.body.message).toBe('Unauthorized');
      });
  });
});
