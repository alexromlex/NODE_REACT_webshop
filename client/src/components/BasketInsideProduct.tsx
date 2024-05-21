import { useState } from 'react';
import { InputGroup, Button, Stack } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import basketStore from '../stores/basketStore';
import { useNavigate } from 'react-router-dom';
import userStore from '../stores/userStore';
import { uuid4 } from '../common/utils';
import { BasketProductProps } from '../common/types';

const BasketProduct: React.FC<BasketProductProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const navigator = useNavigate();

  return (
    <div className={'basket_box'}>
      <Button
        variant="primary"
        className="w-100 mb-3"
        onClick={() => {
          basketStore.addToBasket(product, qty).then(() => {
            setQty(qty);
            navigator('/basket');
          });
        }}>
        Buy now
      </Button>
      <Stack direction="horizontal" gap={3}>
        <div>Qty:</div>
        <InputGroup className="qty-input-group">
          <Button variant="outline-primary" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>
            -
          </Button>
          <Form.Control
            value={qty}
            onChange={(e) =>
              setQty(
                parseInt(e.target.value) === null || isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value)
              )
            }
            type="number"
            min={1}
            className="border-primary text-center"
          />
          <Button variant="outline-primary" onClick={() => setQty(qty + 1)}>
            +
          </Button>
        </InputGroup>

        <Button
          variant="outline-primary"
          disabled={qty > 0 ? false : true}
          onClick={() => {
            basketStore.addToBasket(product, qty);
            setQty(1);
            userStore.addToast({
              id: uuid4(),
              style: 'primary',
              delay: 1500,
              title: 'Added to Basket',
              body: product.name + ' has been adedd to your Basket!',
            });
          }}>
          Add to Basket
        </Button>
      </Stack>
    </div>
  );
};

export default BasketProduct;
