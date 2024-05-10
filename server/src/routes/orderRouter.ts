import Router from 'express';
const router = Router();
import OrderController from '../controllers/orderController';
import hasRoles from '../middleware/checkUserRoleMiddleware';

router.route('/').get(hasRoles(['ADMIN']), (...args) => new OrderController().getAllOrder(...args));

router.route('/user').get(hasRoles(['USER', 'ADMIN']), (...args) => new OrderController().getUserOrders(...args));

router.route('/update/:id').patch(hasRoles(['ADMIN']), (...args) => new OrderController().updateOrder(...args));

router.route('/new').post(hasRoles(['USER', 'ADMIN']), (...args) => new OrderController().newOrder(...args));

router
  .route('/cancel')
  .post(hasRoles(['USER', 'ADMIN']), (...args) => new OrderController().cancelOrderByUser(...args));
router
  .route('/statistic/by_status')
  .post(hasRoles(['ADMIN']), (...args) => new OrderController().getOrderStatisticByStatus(...args));
router
  .route('/statistic/aov')
  .post(hasRoles(['ADMIN']), (...args) => new OrderController().getOrderStatisticAOV(...args));
router
  .route('/statistic/best_sellers')
  .post(hasRoles(['ADMIN']), (...args) => new OrderController().getOrderProductBestSellers(...args));
router
  .route('/statistic/count_status')
  .post(hasRoles(['ADMIN']), (...args) => new OrderController().countOrderByStatus(...args));
router
  .route('/statistic/monthly_sales')
  .post(hasRoles(['ADMIN']), (...args) => new OrderController().monthlySales(...args));

export default router;
