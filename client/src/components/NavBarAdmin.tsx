import { useLocation } from 'react-router-dom';
import { Badge, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { countOrderByStatus } from '../api/orderApi';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderByStatus, setOrderByStatus] = useState({ new: 0, released: 0 });

  useEffect(() => {
    countOrderByStatus({ statuses: ['new', 'released'] })
      .then(({ data }) => {
        setOrderByStatus(data);
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <ListGroup className="admin-main-navbar mb-3">
      <ListGroup.Item
        action
        active={location.pathname === '/admin'}
        onClick={() => {
          navigate('/admin');
        }}>
        Dashboard
      </ListGroup.Item>
      <ListGroup.Item
        action
        active={location.pathname === '/admin/orders'}
        onClick={() => {
          navigate('/admin/orders');
        }}>
        Orders
        {orderByStatus.new > 0 && (
          <Badge bg="primary" pill className="ms-3" title="New">
            {orderByStatus.new}
          </Badge>
        )}
        {orderByStatus.released > 0 && (
          <Badge bg="warning" text="dark" pill className="ms-3" title="Released">
            {orderByStatus.released}
          </Badge>
        )}
      </ListGroup.Item>
      <ListGroup.Item
        action
        active={location.pathname === '/admin/bills'}
        onClick={() => {
          navigate('/admin/bills');
        }}>
        Bills
      </ListGroup.Item>

      <ListGroup.Item
        action
        active={location.pathname === '/admin/users'}
        onClick={() => {
          navigate('/admin/users');
        }}>
        Users
      </ListGroup.Item>
      <ListGroup.Item
        action
        active={location.pathname === '/admin/products'}
        onClick={() => {
          navigate('/admin/products');
        }}>
        Products
      </ListGroup.Item>
      <ListGroup.Item
        action
        active={location.pathname === '/admin/types'}
        onClick={() => {
          navigate('/admin/types');
        }}>
        Types
      </ListGroup.Item>
      <ListGroup.Item
        action
        active={location.pathname === '/admin/brands'}
        onClick={() => {
          navigate('/admin/brands');
        }}>
        Brands
      </ListGroup.Item>
      <ListGroup.Item
        action
        active={location.pathname === '/admin/settings'}
        onClick={() => {
          navigate('/admin/settings');
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-gear me-3"
          viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
        </svg>
        Settings
      </ListGroup.Item>
    </ListGroup>
  );
};

export default observer(AdminNavBar);
