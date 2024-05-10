import Router from 'express';
import hasRoles from '../middleware/checkUserRoleMiddleware';
import sequelize from '../database/connect';
import { NextFunction, Request, Response } from 'express';
import { User } from '../database/models/models';
import bcrypt from 'bcrypt';
import SettingsService from '../services/settingsService';
const router = Router();

const createSettingsOnStart = async () => {
  const values = [
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
  await new SettingsService().createSettings(values);
};

router.route('/db_sync').get(
  // hasRoles(['ADMIN']),
  (req: Request, res: Response, next: NextFunction) => {
    const log: string[] = [];
    sequelize
      .authenticate()
      .then(() => {
        sequelize
          .sync()
          .then(async () => {
            log.push('>>> DB has been Synchronized!');
            const users = await User.findAll();
            if (!users || users.length > 0) return;
            User.create({
              email: process.env.ADMIN_USER_EMAIL!,
              role: 'ADMIN',
              password: await bcrypt.hash(String(process.env.ADMIN_USER_PASS), 4),
            })
              .then(() => {
                log.push('>>> NEW - User(ADMIN) created!');
              })
              .catch((error) => {
                log.push('- ERROR - User(ADMIN) not created! see logs');
                console.log('ERROR CREATE USER: ', error);
              });

            createSettingsOnStart().then(() => {
              log.push('>>> NEW - SETTINGS created!');
            });
          })
          .catch((e) => {
            log.push('- DB SYNC ERROR! see logs');
            console.log('ERROR DB SYNC: ', e);
          });
      })
      .catch((error) => {
        log.push('- DB AUTH ERROR! see logs');
        console.log('ERROR DB AUTH: ', error);
      })
      .finally(() => {
        return res.json(log.join('\n'));
      });
  }
);

export default router;
