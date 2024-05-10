import Router from 'express';
const router = Router();
import BasketController from '../controllers/basketController';
import checkBasket from '../middleware/basketMiddleware';

router.route('/').post(checkBasket, (...args) => new BasketController().getBasketProducts(...args));
router.route('/add').post((...args) => new BasketController().addToBasket(...args));
router.route('/delete').post((...args) => new BasketController().deleteFromBasket(...args));
router.route('/empty').get((...args) => new BasketController().emptyBasket(...args));

export default router;
