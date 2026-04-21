import 'dotenv/config';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandleMiddleware';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import path from 'path';


const swaggerDocument = require('../swagger_output.json');

const app = express();
export const createServer = () => {
  app
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(
      cors({
        origin: true,
        credentials: true}))
    .use(cookieParser())
    .use(helmet({ crossOriginResourcePolicy: false }))
    .use(json())
    .use(express.static(path.join(__dirname, '../static'), {
      setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
      },
    }))
    .use(fileUpload({}))
    .use('/api', router)
    .use(errorHandler)
    .disable('x-powered-by');



  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'NODE REACT webshop API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #333; }'
  }));
  
  app.get('/api-docs.json', (req, res) => {
            res.download(path.join(__dirname, '../swagger_output.json'), 'webshop-api-schema.json');
        });
  
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json('Hellow from server!');
  });

  app.get('/healthcheck', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ ok: true, environment: process.env.NODE_ENV });
  });

  app.use('*', (req, res) => {
      res.status(404).json({ 
          success: false, 
          error: 'Route not found' 
      });
  });

  app.use((req, res, next) => {
    const filePattern = /\.(json|js|ts|env|map|md|git|lock)$/i;

    if (filePattern.test(req.path)) {
        return res.status(403).json({ 
            success: false, 
            error: 'Access denied' 
        });
    }
    
    next();
  });

  return app;
};
