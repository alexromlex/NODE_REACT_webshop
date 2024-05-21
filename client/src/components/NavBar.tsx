import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import userStore from '../stores/userStore';
import { observer } from 'mobx-react-lite';
import basketStore from '../stores/basketStore';
import SearchBarDropDown from './SearchBar';
import mainStore from '../stores/mainStore';

const NavBar = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    userStore.logoutUser();
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <Navbar key={'md'} expand={'md'} bg="light" fixed={'top'} className="mb-3 navbar-header">
      <Container fluid className="m-0 p-0 ps-3 pe-3">
        {mainStore.headerImg && (
          <img
            src={mainStore.headerImg}
            alt={mainStore.headerName}
            height={40}
            style={{ width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
            className="me-3"
            onClick={() => navigate('/')}
          />
        )}
        <NavLink className="navbar-brand" to={'/'}>
          {mainStore.headerName}
        </NavLink>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              <NavLink className={'nav-link'} to="/">
                {mainStore.headerName}
              </NavLink>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <NavLink className={'nav-link'} to="/">
                Home
              </NavLink>

              {!userStore.isAuth ? (
                <NavLink className={'nav-link'} to="/login">
                  SingUp
                </NavLink>
              ) : (
                <NavDropdown
                  autoClose
                  active
                  title={userStore.user?.name ? userStore.user?.name : 'Hi User!'}
                  id={`offcanvasNavbarDropdown-expand-md`}>
                  <NavLink to={'/user'} className={'dropdown-item'}>
                    My profile
                  </NavLink>

                  <NavLink to={'/orders'} className={'dropdown-item'}>
                    My orders
                  </NavLink>
                  <NavDropdown.Divider className="m-0" />
                  {userStore.user?.role === 'ADMIN' && (
                    <NavLink to={'/admin'} className={'dropdown-item'}>
                      Admin
                    </NavLink>
                  )}
                  <NavDropdown.Divider className="m-0" />
                  <NavDropdown.Item href="" onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {basketStore.basketProductQuantity > 0 && (
                <NavLink to={'/basket'} className={'nav-link'}>
                  Basket <span className="badge rounded-pill bg-danger">{basketStore.basketProductQuantity}</span>
                </NavLink>
              )}
            </Nav>
            <SearchBarDropDown />
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default observer(NavBar);
