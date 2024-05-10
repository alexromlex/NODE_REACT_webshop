import supertest from 'supertest';
import { createServer } from '../server';

describe('SERVER HEALTHCHECK', () => {
  test('health check returns 200', async () => {
    await supertest(createServer())
      .get('/healthcheck')
      .expect(200)
      .then((res) => {
        expect(res.body.ok).toBe(true);
      });
  });
});
