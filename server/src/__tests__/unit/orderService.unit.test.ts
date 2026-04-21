/**
 * @group unit
 * @group smoke
 * @group orderService
 */
jest.mock('../../repositories/orderRepo', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    create: jest.fn()
  }))
}));

import OrderService from '../../services/orderService';
import { userFixt } from '../__fixtures__/users';

describe('OrderService', () => {
    let orderService: OrderService;
    const mockValues = {
        user: userFixt,
        basket_items: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 1 }
        ],
        amount: 500, // 2*100 + 1*300 = 500
        shipping: { price: 50 },
        payment: { price: 10 },
        invoiceData: { name: 'Test' },
        deliveryData: { address: 'Test' }
    };
    const mockProducts = [
        { id: 1, price: 100, name: 'Product1', type: { name: 'Type1' }, brand: { name: 'Brand1' }, info: [] },
        { id: 2, price: 300, name: 'Product2', type: { name: 'Type2' }, brand: { name: 'Brand2' }, info: [] }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // jest.spyOn(sequelize, 'transaction').mockImplementation((callback: any) => callback());
        orderService = new OrderService();

    });

    test('NULL payload => Error: data required', async () => {
        await expect(orderService.newOrder(null as any)).rejects.toThrow('values required');
    });

    test('Return: order details {amount, items}', async () => {
        // @ts-ignore private function
        const { calcAmount, items } = orderService.calculateOrderDetails(mockProducts, mockValues.basket_items);
        expect(calcAmount).toBe(500);
        expect(items).toHaveLength(2);
        expect(items[0]).toMatchObject({
            name: 'Product1',
            price: 100,
            quantity: 2,
            product_id: 1
        });
        expect(items[1]).toMatchObject({
            name: 'Product2',
            price: 300,
            quantity: 1,
            product_id: 2
        }); 
    });
})
