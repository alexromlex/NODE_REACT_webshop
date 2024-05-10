import { Router } from 'express';
import TypeController from '../controllers/typeController';
const router = Router();
import hasRoles from '../middleware/checkUserRoleMiddleware';

router
  .route('/')
  .get((...args) => new TypeController().getAllTypes(...args))
  .post(hasRoles(['ADMIN']), (...args) => new TypeController().create(...args));

router
  .route('/:id')
  .get((...args) => new TypeController().getOneType(...args))
  .delete(hasRoles(['ADMIN']), (...args) => new TypeController().delete(...args))
  .patch(hasRoles(['ADMIN']), (...args) => new TypeController().update(...args));

export default router;
