/**
 * @group unit
 * @group smoke
 * @group controllers
 */

import supertest from 'supertest';
import { createServer } from '../../server';


describe('SERVER API', () => {
  
  test('GET / => 200', async () => {
    await supertest(createServer())
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body).toBe('Hellow from server!');
      });
  });

  test('GET /healthcheck => 200', async () => {
    await supertest(createServer())
      .get('/healthcheck')
      .expect(200)
      .then((res) => {
        expect(res.body.ok).toBe(true);
      });
  });

  test('GET /some-endpoint => 404', async () => {
    await supertest(createServer())
      .get('/some-endpoint')
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe('Route not found');
      });
  });

  test('GET /package.json => 403', async () => {
    await supertest(createServer())
      .get('/package.json')
      .expect(404);
  });

  test('GET /testImage.jpg => 200', async () => {
    await supertest(createServer())
      .get('/testImage.jpg')
      .expect(200)
      .then((res) => {
        expect(res.headers['content-type']).toBe('image/jpeg');
      });
  });
});





// #######  USER #######
const mockedUserServiceMethods = {
  getAll: jest.fn(),
  getById: jest.fn(),
  registration: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  login: jest.fn(),
  getMontlyUserRegs: jest.fn()
};

jest.mock('../../services/userService', () => {
  return jest.fn().mockImplementation(() => mockedUserServiceMethods);
});


const userAPIData = [
  {name: 'Get user without id', method: 'get', endpoint: '/', expectedStatus: 404},
  {name: 'Get user by id: 1', method: 'get', endpoint: '/1', expectedStatus: 401},
  {name: 'Registration with NO data', method: 'post', endpoint: '/registration', expectedStatus: 400},
  {name: 'Login with NO Data', method: 'post', endpoint: '/login', expectedStatus: 400},
  {name: 'Auth with NO token', method: 'get', endpoint: '/auth', expectedStatus: 401},
  // ADMIN ZONE
  {name: 'Create user as Admin', method: 'post', endpoint: '/', expectedStatus: 401},
  {name: 'Get monthly user registrations as Admin', method: 'post', endpoint: '/statistic/monthly_regs', expectedStatus: 401},
  {name: 'Get all users as Admin', method: 'get', endpoint: '/all/', expectedStatus: 401},
]
describe('USER CONTROLLER', () => {
  const prefix = '/api/user';
  test.each(userAPIData)(`$method ${prefix}$endpoint $name => $expectedStatus`, async ({ method, endpoint, expectedStatus}) => {
    await supertest(createServer())
      [method](prefix + endpoint)
      .expect(expectedStatus);
  });
});

// #######  SETTINGS #######
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

const adminSettingsAPIData = [
  {name: 'Get settings', method: 'get', endpoint: '/', expectedStatus: 401},
  {name: 'Get update settings', method: 'patch', endpoint: '/', expectedStatus: 401},
  {name: 'Get title and logo', method: 'get', endpoint: '/main', expectedStatus: 200},
  {name: 'Get General Terms', method: 'get', endpoint: '/genterms', expectedStatus: 200},
  {name: 'Get Privacy Policy', method: 'get', endpoint: '/privacy', expectedStatus: 200},
  {name: 'Get billing settings', method: 'get', endpoint: '/billing', expectedStatus: 401}
]
describe('SETTINGS CONTROLLER', () => {
  const prefix = '/api/settings';
  const server = createServer();
  settings_findByOptions.mockResolvedValue({'value': 'Test'});
  settings_getAll.mockResolvedValue([{'value': 'Test'}])
  test.each(adminSettingsAPIData)(`$method ${prefix}$endpoint $name => $expectedStatus`, async ({ method, endpoint, expectedStatus}) => {
    const response = await supertest(server)[method](prefix + endpoint);
    expect(response.status).toBe(expectedStatus);
  });


});

