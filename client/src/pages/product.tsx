import { useEffect, useState } from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import StarRating from '../ui/rating/stars';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import BasketProduct from '../components/BasketInsideProduct';
import ProductInfo from '../components/ProductInfo';
import { regexName } from '../common/utils';
import { getProduct } from '../api/productsApi';
import { ProductInterface } from '../common/types';
import { serverUrl } from '../api/http';
import ProductList from '../components/ProductList';

const ProductPage = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const [product, setProduct] = useState<ProductInterface | null>(null);

  let productId = location.pathname.replace('/product/', '');
  if (productId) productId = regexName(productId, '-');
  useEffect(() => {
    const fetchProductData = async () => {
      await getProduct(Number(productId))
        .then((product) => {
          setProduct(product);
        })
        .catch((error) => {
          console.log('ERROR: ', error);
          navigator('/page_not_found');
        });
    };
    fetchProductData();
  }, [navigator, productId]);

  return (
    <>
      {product && (
        <Container fluid={'xxl'} className="m-0 ps-3 pe-3 ps-xxl-0 pe-xxl-0" datatype="product">
          <Row className="g-0">
            <Col sm className="product_left_bar">
              <div className="d-flex justify-content-center">
                <img className={'img-fluid'} src={serverUrl + '/static/' + product.img} alt={product.name} />
              </div>
              <div className="mt-3">
                <ProductInfo id={product.id!} name={'Specification'} data={product.info!} opened={true} />
              </div>
            </Col>
            <Col sm={'auto'} className="product_right_bar">
              <div className="sticky">
                <section className="product_info">
                  <div className="price fs-1">{Number(product.price).toLocaleString('hu-HU')} HUF</div>
                  <h1 className="name fs-3">{product.name}</h1>
                  <Stack direction="horizontal" gap={3}>
                    <StarRating rating={product.rating ? (product.rating / 5) * 100 : 0} />
                    <div>(125)</div>
                  </Stack>

                  <h4 className="type_brand fs-6">
                    <NavLink to={'/?brand=' + regexName(product.brand!.name, '-')}>
                      <span className="badge text-bg-primary">{product.brand!.name}</span>
                    </NavLink>
                    <NavLink to={'/?type=' + regexName(product.type!.name, '-')}>
                      <span className="badge text-bg-secondary ms-1">{product.type!.name}</span>
                    </NavLink>
                  </h4>
                  <div className="row g-2">
                    <div className="name-1 col-auto">Shipping: </div>
                    <div className="name-2 col">2-5 days</div>
                  </div>
                  <div className="row g-2">
                    <div className="name-1 col-auto">Our garanty: </div>
                    <div className="name-2 col">3 years</div>
                  </div>
                  <div className="row g-2">
                    <div className="name-1 col-auto">Delivery options: </div>
                    <div className="name-2 col">
                      <div>- Courier Services</div>
                      <div>- Box Station</div>
                      <div>- Manual in shop</div>
                    </div>
                  </div>
                </section>
                <div className="mt-3">
                  <BasketProduct product={product} />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="">
            <h4 className="p-0 m-0 mt-3">More {product.type!.name}</h4>
            <ProductList
              type={product.type!.id}
              brand={null}
              page={1}
              limit={6}
              sort={['updatedAt', 'DESC']}
              v={null}
            />
            <h4 className="p-0 m-0 mt-3">More by {product.brand!.name}</h4>
            <ProductList
              type={null}
              brand={product.brand!.id}
              page={1}
              limit={6}
              sort={['updatedAt', 'DESC']}
              v={null}
            />
          </Row>
        </Container>
      )}
    </>
  );
};

export default ProductPage;
