import { Button, Container, Row, InputGroup, Form } from 'react-bootstrap';
import EditDeleteTable from '../../components/EditDeleteTable';
import { useEffect, useState } from 'react';
import ModalWindow from '../../ui/modal';
import adminStore from '../../stores/adminStore';
import { observer } from 'mobx-react-lite';
import { ProductInterface } from '../../common/types';
import { deleteProduct, getProduct, getProducts } from '../../api/productsApi';
import ProductModalBody from '../../components/ProductModalBodyAdmin';
import PagesComponent from '../../components/Paginator';
import { getType, getTypes } from '../../api/typesApi';
import { getBrands } from '../../api/brandsApi';
import { useSearchParams } from 'react-router-dom';
import TypeBrandSelector from '../../components/TypeBrandSelector';
import { priceFormatter, regexName } from '../../common/utils';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

const ProductsAdmin = () => {
  const [modalShow, setModalShow] = useState(false);
  const [editItem, setEditItem] = useState<ProductInterface | null>(null);
  const [modalTitle, setModalTitle] = useState('PRODUCT - new');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchType = String(searchParams.get('type')) || null;
  const searchBrand = String(searchParams.get('brand')) || null;
  const searchPage = Number(searchParams.get('page') || adminStore.page);
  const [searchV, setSearchV] = useState(String(searchParams.get('v')));

  useEffect(() => {
    if (searchPage > 0) adminStore.setPage(searchPage);
    if (searchV && searchV !== 'null') adminStore.setV(searchV);

    const fetchData = async () => {
      // TYPES
      if (!adminStore.types || adminStore.types.length === 0) {
        const types = await getTypes();
        if (!types) return;
        adminStore.setTypes(types);
      }

      if (searchType) {
        const indx = adminStore.types.findIndex((t) => regexName(t.name, '-') === regexName(searchType, '-'));
        if (indx > -1) adminStore.setSelectedType(adminStore.types[indx]);
      }

      // BRANDS
      if (adminStore.selectedType) {
        const type = await getType(adminStore.selectedType?.id);
        if (type) {
          adminStore.setBrands(type.brands);
        }
      } else {
        const brands = await getBrands();
        if (brands) adminStore.setBrands(brands);
      }
      if (searchBrand) {
        const indx = adminStore.brands.findIndex((t) => regexName(t.name, '-') === regexName(searchBrand, '-'));
        if (indx > -1) {
          adminStore.setSelectedBrand(adminStore.brands[indx]);
        }
      }
      // PRODUCTS

      getProducts(
        adminStore.selectedType ? adminStore.selectedType.id : null,
        adminStore.selectedBrand ? adminStore.selectedBrand.id : null,
        adminStore.page,
        adminStore.limit_pages,
        adminStore.sort,
        adminStore.v
      )
        .then(({ data }) => {
          adminStore.setProducts(data.rows);
          adminStore.setTotalPages(Math.ceil(data.count / adminStore.limit_pages));
        })
        .catch((e) => console.error(e));
    };
    fetchData();
    return () => {
      adminStore.setSelectedBrand(null);
      adminStore.setSelectedType(null);
      adminStore.setPage(1);
    };
  }, [searchBrand, searchPage, searchType, searchV]);

  const editClickHandler = (data: ProductInterface) => {
    setModalTitle('EDIT');
    getProduct(data.id!)
      .then((product) => {
        setEditItem(product);
        setModalShow(true);
      })
      .catch((e) => console.log(e));
  };

  const deleteClickHandler = (id: number) => {
    deleteProduct(id)
      .then(() => adminStore.deleteProduct(id))
      .catch((error) => console.error(error));
  };
  const pageChangeHandler = (page: number) => {
    adminStore.setPage(page);
    // searchParams.set('page', page.toString());
    // setSearchParams(searchParams);
  };

  const searchHandler = useDebouncedCallback((v: string) => {
    // console.log('debounced called! ', v);
    adminStore.setV(v);
    setSearchV(v);
  }, 2000);
  return (
    <>
      <Container className="p-0 m-0" fluid>
        <Row>
          <h4 className="col-sm-6">PRODUCTS</h4>
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
                placeholder="Search products..."
                onChange={(e) => searchHandler(String(e.target.value))}
              />
            </InputGroup>
            <Button
              size="sm"
              className="text-nowrap"
              onClick={() => {
                setModalShow(true);
                setEditItem(null);
                setModalTitle('NEW');
              }}>
              +<span className="d-inline d-none d-sm-inline"> Add new</span>
            </Button>
          </div>
        </Row>
        <TypeBrandSelector />
        <EditDeleteTable
          cols={[
            { name: 'id' },
            { name: 'img' },
            { name: 'name' },
            { name: 'price', formatter: priceFormatter },
            { name: 'rating' },
          ]}
          rows={adminStore.products}
          onEdit={editClickHandler}
          onDelete={deleteClickHandler}
        />
        {adminStore.total_pages > 1 && (
          <div className="d-flex justify-content-end">
            <PagesComponent
              totalPages={adminStore.total_pages}
              limitPages={adminStore.limit_pages}
              onChangePage={pageChangeHandler}
            />
          </div>
        )}
      </Container>
      <ModalWindow
        body={
          <ProductModalBody
            data={editItem}
            onSave={() => {
              setModalShow(false);
              setEditItem(null);
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

export default observer(ProductsAdmin);
