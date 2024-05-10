import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AdminNavBar from './NavBarAdmin';
import '../assets/scss/admin.scss';

const AdminLayout = () => {
  return (
    <Container fluid={true}>
      <Row>
        <Col md={3}>
          <AdminNavBar />
        </Col>
        <Col md={9}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
