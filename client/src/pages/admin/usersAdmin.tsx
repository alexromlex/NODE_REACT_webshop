import { Button, Container, Row } from 'react-bootstrap';
import EditDeleteTable from '../../components/EditDeleteTable';
import { InputGroup, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ModalWindow from '../../ui/modal';
import Modal from 'react-bootstrap/Modal';
import adminStore, { AdminEditUserInterface, AdminUserInterface } from '../../stores/adminStore';
import { observer } from 'mobx-react-lite';
import { dateFormatter } from '../../common/utils';
import { getUsers } from '../../api/userApi';

const UsersAdmin = () => {
  const [modalNewShow, setModalNewShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [error, setError] = useState('');
  const [editItem, setEditItem] = useState<AdminEditUserInterface | null>(null);
  const [filter, setFilter] = useState(null);
  const [filtered, setFiltered] = useState<AdminUserInterface[]>([]);

  const ModalBodyNew = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [role, setRole] = useState('USER');

    const onSaveHandler = async () => {
      if (email === '' || password === '') {
        setError("Value can't be empty!");
        return;
      }
      const userData = { email, password, role };
      console.log('userData: ', userData);
      const resp = await adminStore.createUser(userData);
      if (resp.status === 200) {
        setModalNewShow(false);
        setFiltered(
          filter
            ? adminStore.users.filter((el) => el.email.toLowerCase().includes(filter.toLowerCase()))
            : adminStore.users
        );
        setError('');
      } else {
        setError(resp.data.message);
      }
    };

    return (
      <>
        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">Email:</InputGroup.Text>
          <Form.Control
            size="sm"
            type="text"
            placeholder="username@mail.com"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">Password:</InputGroup.Text>
          <Form.Control size="sm" type="text" value={password} onChange={(e) => setPass(e.target.value)} />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">Role:</InputGroup.Text>
          <Form.Select size="sm" value={role} onChange={(e) => setRole(e.target.value)}>
            <option defaultChecked value={'USER'}>
              User
            </option>
            <option value={'ADMIN'}>Admin</option>
          </Form.Select>
        </InputGroup>

        {error && (
          <div style={{ color: 'red' }} className="mt-3">
            {error}
          </div>
        )}
        <Modal.Footer className="p-0 pt-3 mt-3">
          <Button
            variant="primary"
            onClick={() => {
              onSaveHandler();
            }}>
            SAVE
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const ModalBodyEdit = (props) => {
    const [email, setEmail] = useState(props.data.email);
    const [password, setPass] = useState('');
    const [role, setRole] = useState(props.data.role);
    return (
      <>
        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">Email:</InputGroup.Text>
          <Form.Control
            size="sm"
            type="text"
            placeholder="username@mail.com"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">New password:</InputGroup.Text>
          <Form.Control
            size="sm"
            type="password"
            placeholder="Leave blank if not modify"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">Role:</InputGroup.Text>
          <Form.Select size="sm" value={role} onChange={(e) => setRole(e.target.value)}>
            <option defaultChecked value={'USER'}>
              User
            </option>
            <option value={'ADMIN'}>Admin</option>
          </Form.Select>
        </InputGroup>
        {error && (
          <div style={{ color: 'red' }} className="mt-3">
            {error}
          </div>
        )}
        <Modal.Footer className="p-0 pt-3 mt-3">
          <Button
            variant="primary"
            onClick={() => {
              onEditSaveHandler({ email, password, role });
            }}>
            SAVE
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const onEditSaveHandler = async (data: AdminUserInterface) => {
    // console.log('onEditHandler: ', data);
    if (data.email === '') {
      setError("Email can't be empty!");
      return;
    }
    const resp = await adminStore.updateUser(editItem.id, data);
    if (resp.status === 200) {
      setModalEditShow(false);
      setFiltered(
        filter
          ? adminStore.users.filter((el) => el.email.toLowerCase().includes(filter.toLowerCase()))
          : adminStore.users
      );
      setError('');
    } else {
      setError(resp.data.message);
    }
  };

  const editClickHandler = (data: AdminUserInterface) => {
    setEditItem(data);
    setModalEditShow(true);
    setError('');
  };

  const deleteClickHandler = async (id: number) => {
    const resp = await adminStore.deleteUser(id);
    if (resp.status !== 200) {
      return setError(resp);
    }
    setFiltered(
      filter ? adminStore.users.filter((el) => el.email.toLowerCase().includes(filter.toLowerCase())) : adminStore.users
    );
  };

  useEffect(() => {
    getUsers().then((data) => {
      adminStore.setUsers(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    setFiltered(
      filter ? adminStore.users.filter((el) => el.email.toLowerCase().includes(filter.toLowerCase())) : adminStore.users
    );
  }, [filter]);

  return (
    <>
      <Container className="p-0 m-0" fluid>
        <Row>
          <h4 className="col-sm-6">USERS</h4>
          <div className="col-sm-6 d-flex justify-content-between gap-3">
            <InputGroup size="sm" className="">
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
                placeholder="Filter users..."
                onChange={(e) => setFilter(String(e.target.value))}
              />
            </InputGroup>
            <Button
              size="sm"
              className="text-nowrap"
              onClick={() => {
                setModalNewShow(true);
                setError('');
              }}>
              +<span className="d-inline d-none d-sm-inline"> Add new</span>
            </Button>
          </div>
        </Row>
        <EditDeleteTable
          cols={[
            { name: 'id' },
            { name: 'email' },
            { name: 'createdAt', alias: 'registered', formatter: dateFormatter },
            { name: 'role' },
          ]}
          rows={filtered}
          onEdit={editClickHandler}
          onDelete={deleteClickHandler}
        />
      </Container>
      <ModalWindow
        body={<ModalBodyNew />}
        title={'USER - new'}
        modalProps={{
          show: modalNewShow,
          onHide: () => setModalNewShow(false),
          size: 'lg',
          centered: true,
        }}></ModalWindow>
      <ModalWindow
        body={<ModalBodyEdit data={editItem} />}
        title={'USER - edit'}
        modalProps={{
          show: modalEditShow,
          onHide: () => setModalEditShow(false),
          size: 'lg',
          centered: true,
        }}></ModalWindow>
    </>
  );
};

export default observer(UsersAdmin);
