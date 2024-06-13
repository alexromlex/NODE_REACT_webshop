import 'dotenv/config';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandleMiddleware';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import client from 'prom-client';

const register = new client.Registry();
register.setDefaultLabels({ app: 'backend' });
client.collectDefaultMetrics({ register });
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});
register.registerMetric(httpRequestDurationMicroseconds);

const app = express();
export const createServer = () => {
  app
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(
      cors({
        origin: true,
        credentials: true,
      })
    )
    .use(cookieParser())
    .use(helmet())
    .use(json())
    .use(
      express.static('.', {
        setHeaders: (res) => {
          res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
        },
      })
    )
    .use(fileUpload({}))
    .use('/api', router)
    .use(errorHandler);

  app.disable('x-powered-by');

  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json('Hellow from server!');
  });

  app.get('/healthcheck', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ ok: true, environment: process.env.NODE_ENV });
  });

  app.get('/metrics', async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  return app;
};
