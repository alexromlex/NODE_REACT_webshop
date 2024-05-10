import supertest from 'supertest';
import { userAdminFixt, userFixt } from '../__fixtures__/users';
import jwt from 'jsonwebtoken';
import { createServer } from '../../server';
import SettingsRepository from '../../repositories/settingsRepo';
import { settingsAllFixt } from '../__fixtures__/settings';
const settings_getAll = jest.fn(),
  settings_findByOptions = jest.fn(),
  settings_findOrCreate = jest.fn(),
  settings_update = jest.fn();

jest.mock('../../repositories/settingsRepo', () => {
  return jest.fn().mockImplementation(() => ({
    getAll: settings_getAll,
    findByOptions: settings_findByOptions,
    findOrCreate: settings_findOrCreate,
    update: settings_update,
  }));
});

process.env.SECRET_KEY = 'kjdfh8ghdkjfngdfijbodsdlfdoighn';
process.env.TOKEN_PREFIX = 'ROMLEX';
const adminToken = jwt.sign(userAdminFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });
const userToken = jwt.sign(userFixt, process.env.SECRET_KEY!, { expiresIn: '1h' });

beforeEach(() => {
  //@ts-ignore
  SettingsRepository.mockClear();
  settings_getAll.mockClear();
  settings_findByOptions.mockClear();
  settings_findOrCreate.mockClear();
  settings_update.mockClear();
});

describe('API / SETTINGS POSITIVE', () => {
  settings_getAll.mockImplementation(() => settingsAllFixt);
  const founded_billing = settingsAllFixt.filter((el) =>
    [
      'billing_fullname',
      'billing_country',
      'billing_index',
      'billing_city',
      'billing_street',
      'billing_tax',
      'billing_bank_name',
      'billing_bank_account',
      'billing_bank_info',
    ].includes(el.name)
  );
  test('GET - / => array with settings object', async () => {
    await supertest(createServer())
      .get('/api/settings')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty('settings');
        expect(result.body.settings.length).toBeGreaterThan(0);
      });
  });
  test('GET - / => array with main settings names:[header_img, header_name]', async () => {
    settings_getAll.mockImplementation(() =>
      settingsAllFixt.filter((el) => ['header_name', 'header_img'].includes(el.name))
    );
    await supertest(createServer())
      .get('/api/settings/main')
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty('header_name');
        expect(result.body).toHaveProperty('header_img');
      });
  });
  test('GET - / => string', async () => {
    const found = settingsAllFixt.filter((el) => el.name === 'general_terms')[0];
    settings_findByOptions.mockImplementation(() => found);
    await supertest(createServer())
      .get('/api/settings/genterms')
      .expect(200)
      .then((result) => {
        expect(result.body).toBe(found.value);
      });
  });
  test('GET - /privacy => string', async () => {
    const found = settingsAllFixt.filter((el) => el.name === 'privacy_policy')[0];
    settings_findByOptions.mockImplementation(() => found);
    await supertest(createServer())
      .get('/api/settings/privacy')
      .expect(200)
      .then((result) => {
        expect(result.body).toBe(found.value);
      });
  });
  test('GET - /billing => object with admin access', async () => {
    settings_getAll.mockImplementation(() => founded_billing);
    await supertest(createServer())
      .get('/api/settings/billing')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .expect(200)
      .then((result) => {
        // console.log(result.body);
        expect(Object.keys(result.body).length).toBe(9);
        expect(result.body).toHaveProperty('billing_fullname');
      });
  });
  test('GET - /billing => object with user access', async () => {
    settings_getAll.mockImplementation(() => founded_billing);
    await supertest(createServer())
      .get('/api/settings/billing')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + userToken)
      .expect(200)
      .then((result) => {
        // console.log(result.body);
        expect(Object.keys(result.body).length).toBe(9);
        expect(result.body).toHaveProperty('billing_fullname');
      });
  });
  test('PATCH - / => ', async () => {
    let found = settingsAllFixt.filter((el) => el.name === 'billing_bank_account')[0];
    settings_findByOptions
      .mockImplementation(() => found)
      .mockResolvedValueOnce({ update: jest.fn(), save: jest.fn() });
    settings_update.mockImplementation(() => settingsAllFixt);
    await supertest(createServer())
      .patch('/api/settings')
      .set('Authorization', process.env.TOKEN_PREFIX + ' ' + adminToken)
      .send({
        settings: [
          {
            id: 29,
            name: 'billing_bank_account',
            value: '1111111111111',
            createdAt: '2024-04-10T16:48:09.262Z',
            updatedAt: '2024-04-11T05:36:14.764Z',
          },
        ],
      })
      .expect(200)
      .then((result) => {
        // console.log(result.body);
        expect(result.body).toHaveProperty('updated');
        expect(result.body.updated.billing_bank_account).toBe(true);
      });
  });
});

describe('API / SETTINGS NEGATIVE', () => {
  test('GET - /billing => 401 error Unauthorized', async () => {
    await supertest(createServer())
      .get('/api/settings/billing')
      .expect(401)
      .then((result) => {
        expect(result.body.message).toBe('Unauthorized');
      });
  });
});
