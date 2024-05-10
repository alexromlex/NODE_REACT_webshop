import Router from 'express';
const router = Router();
import ProductController from '../controllers/productController';
import hasRoles from '../middleware/checkUserRoleMiddleware';

router
  .route('/')
  .get((...args) => new ProductController().getAllAndCount(...args))
  .post(hasRoles(['ADMIN']), (...args) => new ProductController().create(...args));

router
  .route('/:id')
  .get((...args) => new ProductController().getOne(...args))
  .delete(hasRoles(['ADMIN']), (...args) => new ProductController().delete(...args))
  .patch(hasRoles(['ADMIN']), (...args) => new ProductController().update(...args));

export default router;
