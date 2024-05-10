import Router from 'express';
const router = Router();
import SettingsController from '../controllers/settingsController';
import hasRoles from '../middleware/checkUserRoleMiddleware';

router.route('/').get(hasRoles(['ADMIN']), (...args) => new SettingsController().getSettings(...args));
router.route('/').patch(hasRoles(['ADMIN']), (...args) => new SettingsController().updateSettings(...args));
router.route('/main').get((...args) => new SettingsController().getMainSettings(...args));
router.route('/genterms').get((...args) => new SettingsController().getGenTermsSettings(...args));
router.route('/privacy').get((...args) => new SettingsController().getPrivacyCondSettings(...args));

router
  .route('/billing')
  .get(hasRoles(['USER', 'ADMIN']), (...args) => new SettingsController().getBillingSettings(...args));

export default router;
