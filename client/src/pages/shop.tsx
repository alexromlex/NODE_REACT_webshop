import { Col, Container, Row } from 'react-bootstrap';
import TypeBar from '../components/TypeBar';
import BrandBar from '../components/BrandBar';
import ProductList from '../components/ProductList';
import { Suspense, useEffect } from 'react';
import { getType, getTypes } from '../api/typesApi';
import productStore from '../stores/productStore';
import { getBrands } from '../api/brandsApi';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import { regexName } from '../common/utils';
import { ProductListSkeleton } from '../ui/skeletons';
import PagesComponent from '../components/Paginator';
import SortProduct from '../components/sortProduct';

const ShopPage = () => {
  // console.log('[ShopPage] called!');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchType = String(searchParams.get('type')) || null;
  const searchBrand = String(searchParams.get('brand')) || null;
  const searchV = String(searchParams.get('v')) || null;
  const searchPage = Number(searchParams.get('page') || productStore.page);
  let searchSort = String(searchParams.get('sort'));

  useEffect(() => {
    if (searchPage > 0) productStore.setPage(searchPage);
    if (searchSort !== 'null') {
      //@ts-ignore
      productStore.setSearchSort(searchSort.split(',').map((el) => regexName(el, '-', false)));
    }
    if (searchV && searchV !== 'null') productStore.setV(regexName(searchV, '-', false));

    const fetchData = async () => {
      // TYPES
      if (!productStore.types || productStore.types.length === 0) {
        const types = await getTypes();
        if (!types) return;
        productStore.setTypes(types);
      }

      if (searchType) {
        const indx = productStore.types.findIndex((t) => regexName(t.name, '-') === regexName(searchType, '-'));
        if (indx > -1) productStore.setSelectedType(productStore.types[indx]);
      }

      // BRANDS
      if (productStore.selectedType) {
        const type = await getType(productStore.selectedType?.id);
        if (type) {
          productStore.setBrands(type.brands!);
        }
      } else {
        const brands = await getBrands();
        if (brands) productStore.setBrands(brands);
      }
      if (searchBrand) {
        const indx = productStore.brands.findIndex((t) => regexName(t.name, '-') === regexName(searchBrand, '-'));
        if (indx > -1) {
          productStore.setSelectedBrand(productStore.brands[indx]);
        }
      }
    };
    fetchData();
    return () => {
      productStore.setSelectedBrand(null);
      productStore.setSelectedType(null);
      productStore.setPage(1);
    };
  }, [searchBrand, searchPage, searchType, searchSort, searchV]);

  return (
    <Container fluid={true} className="m-0 ps-3 pe-3 ps-xxl-0 pe-xxl-0">
      <Row>
        <Col md={3}>
          <TypeBar />
        </Col>
        <Col md={9}>
          <div className="mb-3">
            <BrandBar />
          </div>
          <Row className="m-0 p-0">
            <Col className="m-0 p-0 d-flex align-items-center justify-content-end pe-3 mb-3">
              {productStore.total_pages > 1 && <SortProduct />}
            </Col>
            <Col xs={'auto'} className="m-0 p-0 mb-3">
              {productStore.total_pages > 1 && (
                <PagesComponent totalPages={productStore.total_pages} limitPages={productStore.limit_pages} />
              )}
            </Col>
          </Row>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList
              type={productStore.selectedType ? productStore.selectedType.id : null}
              brand={productStore.selectedBrand ? productStore.selectedBrand.id : null}
              page={productStore.page}
              limit={productStore.limit_pages}
              sort={productStore.sort}
              v={productStore.v}
            />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
};

export default observer(ShopPage);
