import Router from 'express';
const router = Router();
import productRouter from './productRouter';
import userRouter from './userRouter';
import typRouter from './typeRouter';
import brandRouter from './brandRouter';
import basketRouter from './basketRouter';
import orderRouter from './orderRouter';
import settingsRouter from './settingsRouter';
import systemRouter from './systemRouter';

router.use('/user', userRouter);
router.use('/type', typRouter);
router.use('/brand', brandRouter);
router.use('/product', productRouter);
router.use('/basket', basketRouter);
router.use('/order', orderRouter);
router.use('/settings', settingsRouter);
router.use('/system', systemRouter);
export default router;
