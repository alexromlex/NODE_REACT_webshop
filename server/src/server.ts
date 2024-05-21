import 'dotenv/config';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandleMiddleware';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

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
    .use(helmet({ crossOriginResourcePolicy: false }))
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

  return app;
};
