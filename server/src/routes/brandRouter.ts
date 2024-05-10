import Router from 'express';
const router = Router();
import BrandController from '../controllers/brendController';
import hasRoles from '../middleware/checkUserRoleMiddleware';

router
  .route('/')
  .get((...args) => new BrandController().getAllBrands(...args))
  .post(hasRoles(['ADMIN']), (...args) => new BrandController().create(...args));

router
  .route('/:id')
  .delete(hasRoles(['ADMIN']), (...args) => new BrandController().delete(...args))
  .patch(hasRoles(['ADMIN']), (...args) => new BrandController().update(...args));

export default router;
