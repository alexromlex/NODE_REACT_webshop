import { Container, Row, Col, Table, Modal, Button, Form, Badge } from 'react-bootstrap';
import { useState } from 'react';
import adminStore from '../stores/adminStore';
import orderStore from '../stores/orderStore';
import { statusStyle } from '../common/utils';
import { OrderInterface } from '../common/types';

interface OrderEditModalAdminProps extends OrderInterface {
  onSave(): void;
}

const OrderEditModalAdmin: React.FC<OrderEditModalAdminProps> = (order) => {
  const [status, setStatus] = useState(order.status);
  const [paid, setPaid] = useState(order.paid);
  const onSaveHandler = () => {
    adminStore.updateOrder(order.id, { status: status, paid });
    order.onSave();
  };
  return (
    <>
      <Container fluid>
        <Row className="rounded p-3 bg-warning bg-opacity-25">
          <Col sm>
            <Row>
              <Col className=" col-auto fw-bold" sm="12">
                Date:
              </Col>
              <Col className=" col-auto" sm="auto">
                {new Date(order.createdAt).toLocaleString('hu-HU', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  hourCycle: 'h24',
                })}
              </Col>
            </Row>
          </Col>
          <Col sm>
            <Row>
              <Col className=" col-auto fw-bold" sm="12">
                Number:
              </Col>
              <Col className=" col-auto" sm="auto">
                {order.id}
              </Col>
            </Row>
          </Col>
          <Col sm>
            <Row>
              <Col className=" col-auto fw-bold" sm="12">
                Amount:
              </Col>
              <Col className=" col-auto" sm="auto">
                {order.amount.toLocaleString('hu-HU')} HUF
              </Col>
            </Row>
          </Col>
          <Col sm>
            <Row>
              <Col className=" col-auto fw-bold" sm="12">
                Status:
              </Col>
              <Col className=" col-auto" sm="auto">
                <Form.Select
                  required
                  size="sm"
                  onChange={(e) => setStatus(e.target.value)}
                  defaultValue={status}
                  name="status">
                  {orderStore.orderStatuses.map((s) => (
                    <option value={s} key={s}>
                      {s}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table>
          <thead>
            <tr>
              <th>Items</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {order.item.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.price.toLocaleString('hu-HU')} HUF</td>
                <td>{i.quantity}</td>
              </tr>
            ))}
            <tr>
              <td>SHIPPING ({order.shipping.name})</td>
              <td>{order.shipping.price.toLocaleString('hu-HU')} HUF</td>
              <td>1</td>
            </tr>
            <tr>
              <td>PAYMENT ({order.payment.name})</td>
              <td>{order.payment.price.toLocaleString('hu-HU')} HUF</td>
              <td>1</td>
            </tr>
          </tbody>
        </Table>
        <Row className="gx-3">
          <Col className="bg-info bg-opacity-25 rounded p-3 mb-3 mb-sm-0" sm>
            <h6>Buyer</h6>
            <div>{order.invoice.buyer.fullNameCompany}</div>
            <div>{order.invoice.buyer.country}</div>
            <div>
              {order.invoice.buyer.postcode} {order.invoice.buyer.city}
            </div>
            <div>{order.invoice.buyer.street}</div>
            {order.invoice.buyer.tax && <div>Tax: {order.invoice.buyer.tax}</div>}
          </Col>
          <Col className="bg-info bg-opacity-25 rounded p-3 ms-sm-3" sm>
            <h6>Shipping</h6>
            <div>
              {order.invoice.delivery.firstName} {order.invoice.delivery.lastName}{' '}
            </div>
            <div>{order.invoice.delivery.country}</div>
            <div>
              {order.invoice.delivery.postcode} {order.invoice.delivery.city}
            </div>
            <div>{order.invoice.delivery.street}</div>
            <div>{order.invoice.delivery.delInfo}</div>
            <div>{order.invoice.delivery.tel}</div>
          </Col>
        </Row>
        <Row className="border p-3 mt-3 rounded">
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Order is paid"
            checked={paid}
            onChange={(e) => {
              console.log(e.target.checked);
              setPaid(Boolean(e.target.checked));
            }}
          />
        </Row>
        <Modal.Footer className="p-0 pt-3 mt-3">
          <Button
            variant="primary"
            type="submit"
            disabled={status != order.status || order.paid != paid ? false : true}
            onClick={() => {
              onSaveHandler();
            }}>
            SAVE
          </Button>
        </Modal.Footer>
        <div className="status_help">
          <h6>STATUS information</h6>
          <ul className="fs-11 p-0">
            <li>
              <Badge bg={statusStyle.new.bg} text={statusStyle.new.text}>
                New
              </Badge>{' '}
              - Orders start off with the new status. At this stage you can confirm that the order details are correct
              and make any amendments to the order before moving on to the next step. Once you are happy with the order
              you can choose whether to invoice and wait for payment or release the order for dispatch without waiting
              for payment.
            </li>
            <li>
              <Badge bg={statusStyle.invoiced.bg} text={statusStyle.invoiced.text}>
                Invoiced
              </Badge>{' '}
              - Orders with the invoiced status are waiting for payment. An invoice has been generated and the items on
              the order will not show up in the dispatch section until the invoice is marked as paid.
            </li>
            <li>
              <Badge bg={statusStyle.released.bg} text={statusStyle.released.text}>
                Released
              </Badge>{' '}
              - Orders with the released status are ready to be dispatched and will appear on the picking page in the
              Dispatch section
            </li>
            <li>
              <Badge bg={statusStyle.fulfilled.bg} text={statusStyle.fulfilled.text}>
                Fulfilled
              </Badge>{' '}
              - All the items on this order have been dispatched.
            </li>
            <li>
              <Badge bg={statusStyle.holded.bg} text={statusStyle.holded.text}>
                Holded
              </Badge>
              - This status is used when all the items on an order are on hold. Placing items on hold allows you to mark
              orders as paid without them showing up in the Dispatch section. This can be used when the items are not
              due to arrive for some time such as seasonal pre-orders. When using our built in pre-orders feature items
              are automatically put on hold.
            </li>
            <li>
              <Badge bg={statusStyle.cancelled.bg}>Cancelled</Badge> - This order has been cancelled. Orders with this
              status are effectively deleted and will no longer appear to customers or on the admin site unless the
              "Cancelled" status is selected on the Orders page.
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
};

export default OrderEditModalAdmin;
