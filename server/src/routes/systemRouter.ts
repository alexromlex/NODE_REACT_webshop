import Router from 'express';
import hasRoles from '../middleware/checkUserRoleMiddleware';
import sequelize from '../database/connect';
import { NextFunction, Request, Response } from 'express';
import SettingsService from '../services/settingsService';
import UserService from '../services/userService';
const router = Router();

const defaultSettings = [
  { name: 'general_terms', value: '' },
  { name: 'privacy_policy', value: '' },
  { name: 'header_img', value: '/b-logo.gif' },
  { name: 'header_name', value: 'WEBSHOP' },
  { name: 'billing_fullname', value: '' },
  { name: 'billing_country', value: '' },
  { name: 'billing_index', value: '' },
  { name: 'billing_city', value: '' },
  { name: 'billing_street', value: '' },
  { name: 'billing_tax', value: '' },
  { name: 'billing_bank_name', value: '' },
  { name: 'billing_bank_account', value: '' },
  { name: 'billing_bank_info', value: '' },
];

router.route('/db_sync').get(
  // hasRoles(['ADMIN']),         // uncomment after succesfully syncronisation!
  (req: Request, res: Response, next: NextFunction) => {
    const log: string[] = [];
    Promise.all([
      sequelize.authenticate().then(() => {
        log.push('>>> DB Authorisation successfully!');
      }),
      sequelize.sync().then(async () => {
        log.push('>>> DB has been Synchronized!');
      }),
    ])
      .then(async () => {
        Promise.all([
          new UserService()
            .create({
              email: process.env.ADMIN_USER_EMAIL!,
              role: 'ADMIN',
              password: process.env.ADMIN_USER_PASS!,
            })
            .then(() => {
              log.push('>>> NEW - User(ADMIN) created!');
            }),
          new SettingsService().createSettings(defaultSettings).then(() => {
            log.push('>>> NEW - SETTINGS created!');
          }),
        ])
          .then(() => {
            res.setHeader('Content-type', 'text/html');
            res.send(
              `<p>${log.join('</br>')}</p><br /><p><a href="http://localhost:${
                process.env.FRONTEND_PORT
              }">Go to website</p>`
            );
          })
          .catch((error) => {
            res.json(error);
          });
      })
      .catch((error) => {
        res.json(error);
      });
  }
);
export default router;
