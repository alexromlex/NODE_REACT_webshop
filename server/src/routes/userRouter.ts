import Router from 'express';
const router = Router();
import userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import hasRoles from '../middleware/checkUserRoleMiddleware';

router.post('/registration', (...args) => new userController().registration(...args));
router.post('/login', (...args) => new userController().login(...args));
router.get('/auth', authMiddleware, (...args) => new userController().check(...args));

router.post('/', hasRoles(['ADMIN']), (...args) => new userController().create(...args));

router
  .route('/statistic/monthly_regs')
  .post(hasRoles(['ADMIN']), (...args) => new userController().getMontlyUserRegs(...args));
router.route('/all/').get(hasRoles(['ADMIN']), (...args) => new userController().getAll(...args));
router
  .route('/:id')
  .get(hasRoles(['ADMIN']), (...args) => new userController().getOne(...args))
  .delete(hasRoles(['ADMIN']), (...args) => new userController().delete(...args))
  .patch(hasRoles(['ADMIN']), (...args) => new userController().update(...args));

export default router;
