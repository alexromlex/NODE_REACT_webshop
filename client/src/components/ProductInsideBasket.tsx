import { useState } from 'react';
import { InputGroup, Button, Stack, Col } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { ProductInterface } from '../common/types';
import basketStore from '../stores/basketStore';
import { NavLink, useNavigate } from 'react-router-dom';
import { serverUrl } from '../api/http';
import { observer } from 'mobx-react-lite';
import ButtonDelete from '../ui/buttons/delete';

interface BasketProductProps {
  product: ProductInterface & { quantity: number };
}

const ProductBasket: React.FC<BasketProductProps> = ({ product }) => {
  const [qty, setQty] = useState(product.quantity);
  const navigator = useNavigate();
  const incementHandler = () => {
    setQty(qty + 1);
    basketStore.addToBasket(product, 1);
  };
  const decrementHandler = () => {
    setQty(qty - 1);
    basketStore.deleteFromBasket(product, 1);
  };

  return (
    <div className="basketItem row border p-3 m-0">
      <Col className="d-flex justify-content-center border product_img">
        <img
          className={'img-fluid'}
          src={serverUrl + '/static/' + product.img}
          alt={product.name}
          onClick={() => {
            navigator('/product/' + product.id!);
          }}
        />
      </Col>
      <Col>
        <h6>
          <NavLink to={'/product/' + product.id}>{product.name}</NavLink>
        </h6>
        <div className={'basket_box row'}>
          <Col>
            <Stack direction="horizontal" gap={3}>
              <div>Qty:</div>
              <InputGroup className="qty-input-group">
                {qty < 2 ? (
                  <ButtonDelete onClickHandler={() => decrementHandler()} />
                ) : (
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      decrementHandler();
                    }}>
                    -
                  </Button>
                )}

                <Form.Control
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      parseInt(e.target.value) === null || isNaN(parseInt(e.target.value))
                        ? 1
                        : parseInt(e.target.value)
                    )
                  }
                  type="number"
                  min={1}
                  className="border-primary text-center"
                  disabled={true}
                />
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    incementHandler();
                  }}>
                  +
                </Button>
              </InputGroup>
            </Stack>
          </Col>
          <Col>
            <div className="itemBlockPrice">{(product.price * qty).toLocaleString('hu-HU')} HUF</div>
          </Col>
        </div>
      </Col>
    </div>
  );
};

export default observer(ProductBasket);
