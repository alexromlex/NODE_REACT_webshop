import { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row, Table, Modal } from 'react-bootstrap';
import orderStore from '../stores/orderStore';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ModalWindow from '../ui/modal';
import OrderModalBody from '../components/OrderModalBody';
import { getBillingSettings } from '../api/settingsApi';
import { OrderInterface } from '../common/types';
import { cancelOrderByUser } from '../api/orderApi';
import { statusStyle } from '../common/utils';

const OrdersPage = () => {
  const [orderData, setOrderData] = useState<OrderInterface | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const [modalShowCancelOrder, setModalShowCancelOrder] = useState(false);
  const [cancelOrderData, setCancelOrderData] = useState(null);

  const navigator = useNavigate();
  const [billing, setBilling] = useState(null);
  useEffect(() => {
    orderStore.getOrders();
    getBillingSettings().then(({ data }) => setBilling(data));
  }, []);
  const orderStatus = (v: string) => {
    return (
      <Badge bg={statusStyle[v].bg} text={statusStyle[v].text}>
        {v}
      </Badge>
    );
  };
  const showOrderDetails = (order: OrderInterface) => {
    setOrderData(order);
    setModalTitle('Order № ' + order.id);
    setModalShow(true);
  };
  const cancelOrderHandler = () => {
    if (!cancelOrderData) return;
    cancelOrderByUser(cancelOrderData.id)
      .then((resp) => {
        // console.log('resp: ', resp);
        orderStore.updateOrder(resp.data);
        setModalShowCancelOrder(false);
        setCancelOrderData(null);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      {orderStore.orders.length === 0 ? (
        <Container fluid>
          <Row className="text-center bg-warning bg-opacity-25 rounded p-3 m-3">You have NO orders!</Row>
          <Row className="d-flex justify-content-center mt-3">
            <Button onClick={() => navigator('/')} className="w-auto">
              Let's start shopping now!
            </Button>
          </Row>
        </Container>
      ) : (
        <>
          <h1>My orders</h1>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order №</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orderStore.orders.map((o) => (
                    <tr key={o.id}>
                      <td className="align-middle">
                        {new Date(o.createdAt).toLocaleString('hu-HU', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                          hourCycle: 'h24',
                        })}
                      </td>
                      <td className="align-middle">{o.id}</td>
                      <td className="align-middle">{o.amount.toLocaleString('hu-HU')} HUF</td>
                      <td className="align-middle">{orderStatus(o.status)}</td>
                      <td className="align-middle">
                        <a
                          href="#"
                          onClick={() => {
                            showOrderDetails(o);
                          }}>
                          Details
                        </a>
                        {o.status === 'new' && (
                          <div className="mt-1">
                            <a
                              href="#"
                              onClick={() => {
                                setCancelOrderData(o);
                                setModalShowCancelOrder(true);
                              }}>
                              Cancel order
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}

      <ModalWindow
        body={<OrderModalBody order={orderData} billing={billing} />}
        title={modalTitle}
        modalProps={{
          show: modalShow,
          onHide: () => {
            setModalShow(false);
          },
          size: 'lg',
          centered: true,
        }}></ModalWindow>
      <Modal show={modalShowCancelOrder} onHide={() => setModalShowCancelOrder(false)}>
        <Modal.Header closeButton>
          <Modal.Title>CANCEL ORDER № {cancelOrderData?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShowCancelOrder(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              cancelOrderHandler();
            }}>
            Yes, CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default observer(OrdersPage);
