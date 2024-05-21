import { Col, Container, Row, Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { OrderModalBodyProps } from '../common/types';
import userStore from '../stores/userStore';

const OrderModalBody: React.FC<OrderModalBodyProps> = ({ order, billing }) => {
  return (
    <Container fluid>
      <Row className="rounded p-3 bg-warning bg-opacity-25">
        <Col sm>
          <Row>
            <Col className=" col-auto fw-bold" sm="12">
              Date:
            </Col>
            <Col className=" col-auto" sm="auto">
              {new Date(order!.createdAt).toLocaleString('hu-HU', {
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
              {order?.id}
            </Col>
          </Row>
        </Col>
        <Col sm>
          <Row>
            <Col className=" col-auto fw-bold" sm="12">
              Amount:
            </Col>
            <Col className=" col-auto" sm="auto">
              {order?.amount.toLocaleString('hu-HU')} HUF
            </Col>
          </Row>
        </Col>
        <Col sm>
          <Row>
            <Col className=" col-auto fw-bold" sm="12">
              Status:
            </Col>
            <Col className=" col-auto" sm="auto">
              {order?.status}
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
          {order!.item.map((i) => (
            <tr key={i.id}>
              <td>
                <NavLink to={'/product/' + i.product_id} className="like_link" target="blank">
                  {i.name}
                </NavLink>
              </td>
              <td>{i.price.toLocaleString('hu-HU')} HUF</td>
              <td>{i.quantity}</td>
            </tr>
          ))}
          <tr>
            <td>SHIPPING ({order?.shipping.name})</td>
            <td>{order?.shipping.price.toLocaleString('hu-HU')} HUF</td>
            <td>1</td>
          </tr>
          <tr>
            <td>PAYMENT ({order?.payment.name})</td>
            <td>{order?.payment.price.toLocaleString('hu-HU')} HUF</td>
            <td>1</td>
          </tr>
        </tbody>
      </Table>
      <Row className="gx-3">
        <Col className="bg-info bg-opacity-25 rounded p-3 mb-3 mb-sm-0" sm>
          <h6>Buyer</h6>
          <div>{order?.invoice.buyer.fullNameCompany}</div>
          <div>{order?.invoice.buyer.country}</div>
          <div>
            {order?.invoice.buyer.postcode} {order?.invoice.buyer.city}
          </div>
          <div>{order?.invoice.buyer.street}</div>
          {order?.invoice.buyer.tax && <div>Tax: {order?.invoice.buyer.tax}</div>}
        </Col>
        <Col className="bg-info bg-opacity-25 rounded p-3 ms-sm-3" sm>
          <h6>Shipping</h6>
          <div>
            {order?.invoice.delivery.firstName} {order?.invoice.delivery.lastName}{' '}
          </div>
          <div>{order?.invoice.delivery.country}</div>
          <div>
            {order?.invoice.delivery.postcode} {order?.invoice.delivery.city}
          </div>
          <div>{order?.invoice.delivery.street}</div>
          <div>{order?.invoice.delivery.delInfo}</div>
          <div>{order?.invoice.delivery.tel}</div>
        </Col>
      </Row>
      <Row className="bg-success bg-opacity-25 rounded p-3 mt-3">
        <Col>
          <div>
            Normal domestic bank transfer fees apply for standard EU transfers. Bank transfers can take 1-3 working days
            to process.
          </div>
          <p>Please transfer the balance of your invoice to our bank account listed below</p>
          <p>
            Please make sure you include your customer number ({userStore.user?.id}) or your order number ({order!.id})
            when you enter the information for your bank transfer. Please transfer the balance to the following account:
          </p>
          <p>
            Transert to: {billing!.billing_fullname}
            <br />
            Bank: {billing!.billing_bank_name}
            <br />
            IBAN: {billing!.billing_bank_account}
            <br />
            {billing!.billing_bank_info}
          </p>
          <p>We’ll ship your order as soon as we have received your payment.</p>
          <p>After your order has been processed, you will receive a confirmation email.</p>
          <p>Best regards, WEBSHOP Team</p>
          <p>
            Please note: You will only pay your bank’s regular domestic fees when making a standard EU bank transfer For
            all standard EU bank transfers you will need the IBAN and BIC codes for the business you are sending funds
            us cannot accept charges for other types of international bank transfers.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderModalBody;
