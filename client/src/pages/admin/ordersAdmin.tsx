import { Container, InputGroup, Row, Form, Badge } from 'react-bootstrap';
import adminStore from '../../stores/adminStore';
import EditDeleteTable from '../../components/EditDeleteTable';
import { observer } from 'mobx-react-lite';
import { dateFormatter, priceFormatter, statusStyle } from '../../common/utils';
import OrderEditModalAdmin from '../../components/OrderEditModalAdmin';
import ModalWindow from '../../ui/modal';
import { useEffect, useState } from 'react';
import { OrderInterface } from '../../common/types';
import { getAllOrder } from '../../api/orderApi';

const OrdersAdmin = () => {
  const [modalShow, setModalShow] = useState(false);
  const [editOrder, setEditOrder] = useState<OrderInterface | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [filter, setFilter] = useState<String | null>(null);
  const [filtered, setFiltered] = useState<OrderInterface[]>([]);

  const editClickHandler = (order: OrderInterface) => {
    setEditOrder(order);
    setModalTitle('EDIT Order № ' + order.id);
    setModalShow(true);
  };
  const deleteClickHandler = () => {};
  const statusFormatter = (v: string) => {
    return (
      <Badge bg={statusStyle[v].bg} text={statusStyle[v].text}>
        {v}
      </Badge>
    );
  };
  const paidFormatter = (v: boolean) => {
    return v ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="green"
        className="bi bi-check-circle-fill"
        viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
    ) : (
      ' - '
    );
  };
  useEffect(() => {
    getAllOrder()
      .then((result) => {
        adminStore.setOrders(result.data);
        setFiltered(
          filter
            ? adminStore.orders.filter((el) => el.status.toLowerCase().includes(filter.toLowerCase()))
            : adminStore.orders
        );
        console.log(filtered);
      })
      .catch((error) => console.error(error));
  }, []);

  const filterHandler = (value: string) => {
    setFilter(value);
    setFiltered(
      filter
        ? adminStore.orders.filter((el) => el.status.toLowerCase().includes(filter.toLowerCase()))
        : adminStore.orders
    );
  };
  useEffect(() => {
    setFiltered(
      filter
        ? adminStore.orders.filter((el) => el.status.toLowerCase().includes(filter.toLowerCase()))
        : adminStore.orders
    );
  }, [filter]);

  return (
    <>
      <Container className="p-0 m-0" fluid>
        <Row>
          <h4 className="col-sm-6">ORDERS</h4>
          <div className="col-sm-6 d-flex justify-content-between gap-3">
            <InputGroup size="sm">
              <InputGroup.Text id="inputGroup-sizing-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </InputGroup.Text>
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Filter by status..."
                onChange={(e) => filterHandler(e.target.value)}
              />
            </InputGroup>
          </div>
        </Row>
        <EditDeleteTable
          cols={[
            { name: 'id' },
            { name: 'createdAt', alias: 'created', formatter: dateFormatter },
            { name: 'invoice.due_date', alias: 'due' },
            { name: 'amount', formatter: priceFormatter },
            { name: 'status', formatter: statusFormatter },
            { name: 'paid', formatter: paidFormatter },
          ]}
          rows={filtered}
          onEdit={editClickHandler}
          onDelete={deleteClickHandler}
        />
      </Container>
      <ModalWindow
        body={
          <OrderEditModalAdmin
            order={editOrder}
            onSave={() => {
              setModalShow(false);
              setEditOrder(null);
            }}
          />
        }
        title={modalTitle}
        modalProps={{
          show: modalShow,
          onHide: () => {
            setModalShow(false);
            setEditOrder(null);
          },
          size: 'lg',
          centered: true,
        }}></ModalWindow>
    </>
  );
};

export default observer(OrdersAdmin);
