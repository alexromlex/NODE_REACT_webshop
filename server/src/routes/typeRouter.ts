import { Router } from 'express';
import TypeController from '../controllers/typeController';
const router = Router();
import hasRoles from '../middleware/checkUserRoleMiddleware';

router
  .route('/')
  .get((...args) => TypeController.getAllTypes(...args))
  .post(hasRoles(['ADMIN']), (...args) => TypeController.create(...args));

router
  .route('/:id')
  .get((...args) => TypeController.getOneType(...args))
  .delete(hasRoles(['ADMIN']), (...args) => TypeController.delete(...args))
  .patch(hasRoles(['ADMIN']), (...args) => TypeController.update(...args));

export default router;
