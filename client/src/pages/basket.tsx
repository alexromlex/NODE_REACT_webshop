import { Container, Row, Col, Button } from 'react-bootstrap';
import basketStore from '../stores/basketStore';
import { observer } from 'mobx-react-lite';

import ProductBasket from '../components/ProductInsideBasket';
import { useNavigate } from 'react-router-dom';

const BasketPage = () => {
  const navigator = useNavigate();
  return (
    <Container fluid={'xxl'} className="m-0 ps-3 pe-3 ps-xxl-0 pe-xxl-0" datatype="basket">
      <Row className="g-0">
        <Col sm className="basket_left_bar">
          {basketStore.basket.length === 0 && (
            <div className="p-3 m-5 rounded text-center bg-secondary bg-opacity-25">
              <span className="fw-bold fs-3">Your basket is empty.</span> <br />
              Start shopping and make you happy! 😊
              <div className="d-flex justify-content-center mt-3">
                <Button onClick={() => navigator('/')}>Continue shopping</Button>
              </div>
            </div>
          )}
          {basketStore.basket.map((product) => (
            <ProductBasket key={product.id} product={product} />
          ))}
        </Col>
        <Col sm={'auto'} className="basket_right_bar">
          <div className="sticky">
            <div className="p-3">
              <span className="fw-bold">Subtotal:</span> {basketStore.basketTotalPrice.toLocaleString('hu-HU')} HUF
            </div>
            <div className="p-3">
              <span className="fw-bold">Shipping Fees:</span> {basketStore.shippingFees.toLocaleString('hu-HU')} HUF
            </div>
            <div className="p-3 rounded bg-secondary fw-bold bg-opacity-25">
              Total: {(basketStore.basketTotalPrice + basketStore.shippingFees).toLocaleString('hu-HU')} HUF
            </div>
            <Button disabled={basketStore.basket.length === 0} className="mt-3" onClick={() => navigator('/checkout')}>
              Proceed to checkout
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default observer(BasketPage);
