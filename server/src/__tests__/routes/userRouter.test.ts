import supertest from 'supertest';
import UserRepository from '../../repositories/userRepo';
import BasketRepository from '../../repositories/basketRepo';
import { userAdminFixt, userFixt, userMonthlyCountRegsFixt } from '../__fixtures__/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createServer } from '../../server';
import { basketUserFixt } from '../__fixtures__/basket';

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });
const userToken = jwt.sign(userFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

const user_create = jest.fn(),
  user_getAll = jest.fn(),
  user_getById = jest.fn(),
  user_findByOptions = jest.fn(),
  user_update = jest.fn(),
  user_delete = jest.fn(),
  user_count = jest.fn(),
  user_getOne = jest.fn();

jest.mock('../../repositories/userRepo', () => {
  return jest.fn().mockImplementation(() => {
    return {
      create: user_create,
      getAll: user_getAll,
      getById: user_getById,
      findByOptions: user_findByOptions,
      update: user_update,
      delete: user_delete,
      count: user_count,
      getOne: user_getOne,
    };
  });
});

const basket_create = jest.fn();
jest.mock('../../repositories/basketRepo', () => {
  return jest.fn().mockImplementation(() => {
    return { create: basket_create };
  });
});

beforeEach(() => {
  // @ts-ignore
  UserRepository.mockClear();
  user_create.mockClear();
  user_getAll.mockClear();
  user_getById.mockClear();
  user_findByOptions.mockClear();
  user_update.mockClear();
  user_delete.mockClear();
  user_count.mockClear();
  // @ts-ignore
  BasketRepository.mockClear();
  basket_create.mockClear();
});

describe('API / USERS POSITIVE', () => {
  test('POST - /registration => token', async () => {
    user_findByOptions.mockImplementation(async () => null);
    user_create.mockImplementation(async () => userFixt);
    basket_create.mockImplementation(async () => basketUserFixt);
    await supertest(createServer())
      .post('/api/user/registration')
      .send({ email: 'test@mail.hu', password: 123 })
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty('token');
      });
  });
  test('POST - /login => token', async () => {
    user_findByOptions.mockImplementation(async () => {
      return { ...userFixt, password: await bcrypt.hash('123456', 4) };
    });
    await supertest(createServer())
      .post('/api/user/login')
      .send({ email: 'user@test.mail', password: '123456' })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('token');
      });
  });
  test('GET - /auth => token', async () => {
    await supertest(createServer())
      .get('/api/user/auth')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('token');
      });
  });
  test('POST - / => created new user', async () => {
    user_findByOptions.mockImplementation(async () => null);
    user_create.mockImplementation(async () => userFixt);
    basket_create.mockImplementation(async () => basketUserFixt);
    await supertest(createServer())
      .post('/api/user')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ email: 'user@test.mail', password: '12345' })
      .expect(200)
      .then((res) => {
        expect(res.body.user).toEqual(userFixt);
      });
  });
  test('POST - /statistic/monthly_regs => array of data', async () => {
    const startDate = new Date();
    user_count.mockImplementation(async () => userMonthlyCountRegsFixt);
    await supertest(createServer())
      .post('/api/user/statistic/monthly_regs')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ startDate: new Date(startDate.setDate(startDate.getMonth() - 1)), endDate: new Date() })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(userMonthlyCountRegsFixt);
      });
  });
  test('GET - /all => array of users', async () => {
    user_getAll.mockImplementation(async () => [userFixt, userFixt]);
    await supertest(createServer())
      .get('/api/user/all')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(2);
      });
  });
  test('GET - /2 => user data', async () => {
    user_getById.mockImplementation(async () => userFixt);
    await supertest(createServer())
      .get('/api/user/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(2);
      });
  });
  test('DELETE - /2 => number of deleted users 1', async () => {
    user_delete.mockImplementation(async () => 1);
    await supertest(createServer())
      .delete('/api/user/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBe(1);
      });
  });
  test('PATCH - /1 => user with updated password', async () => {
    const newPassHash = await bcrypt.hash('5555', 4);
    user_findByOptions.mockImplementation(async () => userFixt);
    user_update.mockImplementation(async () => ({ ...userFixt, password: newPassHash }));
    await supertest(createServer())
      .patch('/api/user/2')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({ id: 2, values: { password: '5555' } })
      .expect(200)
      .then((res) => {
        expect(bcrypt.compareSync('5555', res.body.password)).toBe(true);
      });
  });
});

describe('API / USERS NEGATIVE', () => {
  test('POST - /login => error 403 incorrect password', async () => {
    user_findByOptions.mockImplementation(async () => {
      return { ...userFixt, password: await bcrypt.hash('123456', 4) };
    });
    await supertest(createServer())
      .post('/api/user/login')
      .send({ email: 'user@test.mail', password: '555' })
      .expect(403);
  });
  test('GET - /auth => error 401 Unauthorized', async () => {
    await supertest(createServer())
      .get('/api/user/auth')
      // .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });
  test('GET - /auth with wrong hash => error 401 Unauthorized', async () => {
    await supertest(createServer())
      .get('/api/user/auth')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + 'ffggt45t66')
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });
});
