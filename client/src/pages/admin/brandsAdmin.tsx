import { Button, Container, Row } from 'react-bootstrap';
import EditDeleteTable from '../../components/EditDeleteTable';
import { InputGroup, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ModalWindow from '../../ui/modal';
import Modal from 'react-bootstrap/Modal';
import adminStore from '../../stores/adminStore';
import { BrandInterface } from '../../common/types';
import { observer } from 'mobx-react-lite';
import { getBrands } from '../../api/brandsApi';

const BrandsAdmin = () => {
  const [modalNewShow, setModalNewShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [error, setError] = useState('');
  const [editItem, setEditItem] = useState<BrandInterface | null>(null);
  const [filter, setFilter] = useState(null);
  const [filtered, setFiltered] = useState<BrandInterface[]>([]);

  const ModalBodyNew = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const onSaveHandler = async () => {
      if (name === '') {
        setError("Name can't be empty!");
        return;
      }
      const resp = await adminStore.createBrand(name);
      if (resp.status === 200) {
        setModalNewShow(false);
        setFiltered(
          filter
            ? adminStore.brands.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase()))
            : adminStore.brands
        );
      } else {
        setError(resp.data.message);
      }
    };

    return (
      <>
        <Form.Control
          size="sm"
          type="text"
          placeholder="Brand name"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
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
    const [name, setname] = useState(props.data.name);
    return (
      <>
        <Form.Control
          size="sm"
          type="text"
          placeholder="Type name"
          value={name}
          autoFocus
          onChange={(e) => setname(e.target.value)}
        />
        {error && (
          <div style={{ color: 'red' }} className="mt-3">
            {error}
          </div>
        )}
        <Modal.Footer className="p-0 pt-3 mt-3">
          <Button
            variant="primary"
            onClick={() => {
              onEditSaveHandler({ ...props.data, name: name });
            }}>
            SAVE
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const onEditSaveHandler = async (data: BrandInterface) => {
    // console.log('onEditHandler: ', data);
    if (data.name === '') {
      setError("Name can't be empty!");
      return;
    }
    const resp = await adminStore.updateBrand(data.id, { name: data.name });
    if (resp.status === 200) {
      setModalEditShow(false);
    } else {
      setError(resp);
    }
  };

  const editClickHandler = (data: BrandInterface) => {
    setEditItem(data);
    setModalEditShow(true);
  };

  const deleteClickHandler = async (id: number) => {
    const resp = await adminStore.deleteBrand(id);
    if (resp.status !== 200) {
      setError(resp);
      return;
    }
    setFiltered(
      filter
        ? adminStore.brands.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase()))
        : adminStore.brands
    );
  };

  useEffect(() => {
    getBrands().then((data) => {
      adminStore.setBrands(data);
      if (filter) {
        setFiltered(data.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase())));
      } else {
        setFiltered(data);
      }
    });
  }, []);

  useEffect(() => {
    if (filter) {
      setFiltered(adminStore.brands.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFiltered(adminStore.brands);
    }
  }, [filter]);

  return (
    <>
      <Container className="p-0 m-0" fluid>
        <Row>
          <h4 className="col-sm-6">BRANDS</h4>
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
                placeholder="Filter brands..."
                onChange={(e) => setFilter(String(e.target.value))}
              />
            </InputGroup>
            <Button size="sm" className="text-nowrap" onClick={() => setModalNewShow(true)}>
              +<span className="d-inline d-none d-sm-inline"> Add new</span>
            </Button>
          </div>
        </Row>
        <EditDeleteTable
          cols={[{ name: 'name' }]}
          rows={filtered}
          onEdit={editClickHandler}
          onDelete={deleteClickHandler}
        />
      </Container>
      <ModalWindow
        body={<ModalBodyNew />}
        title={'TYPES - new'}
        modalProps={{
          show: modalNewShow,
          onHide: () => setModalNewShow(false),
          size: 'lg',
          centered: true,
        }}></ModalWindow>
      <ModalWindow
        body={<ModalBodyEdit data={editItem} />}
        title={'TYPES - edit'}
        modalProps={{
          show: modalEditShow,
          onHide: () => setModalEditShow(false),
          size: 'lg',
          centered: true,
        }}></ModalWindow>
    </>
  );
};

export default observer(BrandsAdmin);
