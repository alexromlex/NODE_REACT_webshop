import { makeAutoObservable } from 'mobx';
import { getUserOrders } from '../api/orderApi';
import { OrderInterface } from '../common/types';

class OrderStore {
  _orders: OrderInterface[];
  _orderStatuses: string[];

  constructor() {
    makeAutoObservable(this);
    this._orders = [];
    this._orderStatuses = ['new', 'invoiced', 'released', 'fulfilled', 'holded', 'cancelled'];
  }
  get orders() {
    return this._orders;
  }
  get orderStatuses() {
    return this._orderStatuses;
  }
  *getOrders() {
    try {
      const orders = yield getUserOrders();
      this._orders = orders;
    } catch (error) {
      console.error(error);
    }
  }

  updateOrder(order: OrderInterface) {
    if (this._orders.length === 0) return;
    const indx = this._orders.findIndex((o) => o.id === order.id);
    if (indx === -1) return;
    this._orders[indx] = order;
  }
}

export default new OrderStore();

/* 
New - Orders start off with the new status. At this stage you can confirm that the order details are correct and make any amendments to the order before moving on to the next step. Once you are happy with the order you can choose whether to invoice and wait for payment or release the order for dispatch without waiting for payment.

Invoiced - Orders with the invoiced status are waiting for payment. An invoice has been generated and the items on the order will not show up in the dispatch section until the invoice is marked as paid.

Released - Orders with the released status are ready to be dispatched and will appear on the picking page in the Dispatch section

Fulfilled - All the items on this order have been dispatched.

Holded - This status is used when all the items on an order are on hold. Placing items on hold allows you to mark orders as paid without them showing up in the Dispatch section. This can be used when the items are not due to arrive for some time such as seasonal pre-orders. When using our built in pre-orders feature items are automatically put on hold. 

Cancelled - This order has been cancelled. Orders with this status are effectively deleted and will no longer appear to customers or on the admin site unless the "Cancelled" status is selected on the Orders page.

https://docs.orderspace.com/article/18-order-statuses
*/
