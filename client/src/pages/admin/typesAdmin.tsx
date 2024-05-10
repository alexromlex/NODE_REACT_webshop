import { Button, Container, Row } from 'react-bootstrap';
import EditDeleteTable from '../../components/EditDeleteTable';
import { InputGroup, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ModalWindow from '../../ui/modal';
import adminStore from '../../stores/adminStore';
import { TypeInterface } from '../../common/types';
import { observer } from 'mobx-react-lite';
import { getTypes, getType } from '../../api/typesApi';
import { getBrands } from '../../api/brandsApi';
import ModalTypeBodyAdmin from '../../components/TypeModalBodyAdmin';

const TypesAdmin = () => {
  const [modalShow, setModalShow] = useState(false);
  const [editItem, setEditItem] = useState<TypeInterface | null>(null);
  const [modalTitle, setModalTitle] = useState('TYPES - new');
  const [filter, setFilter] = useState(null);
  const [filtered, setFiltered] = useState<TypeInterface[]>([]);

  const editTypeClickHandler = (data: TypeInterface) => {
    setModalTitle('EDIT');
    getType(data.id).then((type) => {
      console.log('TYPE: ', type);
      setEditItem(type);
      setModalShow(true);
    });
  };

  const deleteTypeClickHandler = async (id: number) => {
    const resp = await adminStore.deleteType(id);
    if (resp.status !== 200) {
      console.log('errer: ', resp);
      return;
    }
    setFiltered(
      filter ? adminStore.types.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase())) : adminStore.types
    );
  };

  const onSaveHandler = () => {
    setModalShow(false);
    setEditItem(null);
    setFiltered(
      filter ? adminStore.types.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase())) : adminStore.types
    );
  };

  useEffect(() => {
    getTypes().then((data) => {
      adminStore.setTypes(data);
      if (filter && data.length > 0) {
        setFiltered(data.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase())));
      } else {
        setFiltered(data);
      }
    });
    getBrands().then((data) => adminStore.setBrands(data));
  }, []);

  useEffect(() => {
    if (filter) {
      setFiltered(adminStore.types.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFiltered(adminStore.types);
    }
  }, [filter]);

  return (
    <>
      <Container className="p-0 m-0" fluid>
        <Row>
          <h4 className="col-sm-6">TYPES</h4>
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
                placeholder="Filter types..."
                onChange={(e) => setFilter(String(e.target.value))}
              />
            </InputGroup>
            <Button
              size="sm"
              className="text-nowrap"
              onClick={() => {
                setModalShow(true);
                setModalTitle('NEW');
                setEditItem(null);
              }}>
              +<span className="d-inline d-none d-sm-inline"> Add new</span>
            </Button>
          </div>
        </Row>
        <EditDeleteTable
          cols={[{ name: 'name' }]}
          rows={filtered}
          onEdit={editTypeClickHandler}
          onDelete={deleteTypeClickHandler}
        />
      </Container>
      <ModalWindow
        body={
          <ModalTypeBodyAdmin
            data={editItem}
            onSave={() => {
              onSaveHandler();
            }}
          />
        }
        title={modalTitle}
        modalProps={{
          show: modalShow,
          onHide: () => {
            setModalShow(false);
            setEditItem(null);
          },
          size: 'lg',
          centered: true,
        }}></ModalWindow>
    </>
  );
};

export default observer(TypesAdmin);
