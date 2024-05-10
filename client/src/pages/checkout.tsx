import { useRef, useState } from 'react';
import basketStore from '../stores/basketStore';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { newOrder } from '../api/orderApi';

const CheckoutPage = () => {
  const navigator = useNavigate();
  const [validated, setValidated] = useState(false);
  const [selectedPayment, setSelectedPyment] = useState('bank');
  const [selectedShipping, setSelectedShipping] = useState('standart');

  const countryRef = useRef<HTMLInputElement>();
  const postcodeRef = useRef<HTMLInputElement>();
  const cityRef = useRef<HTMLInputElement>();
  const streetRef = useRef<HTMLInputElement>();
  const firstNameRef = useRef<HTMLInputElement>();
  const lastNameRef = useRef<HTMLInputElement>();
  const telRef = useRef<HTMLInputElement>();
  const delInfoRef = useRef<HTMLInputElement>();

  const countryRefInv = useRef<HTMLInputElement>();

  const postcodeRefInv = useRef<HTMLInputElement>();
  const cityRefInv = useRef<HTMLInputElement>();
  const streetRefInv = useRef<HTMLInputElement>();
  const fullnameRefInv = useRef<HTMLInputElement>();
  const taxRefInv = useRef<HTMLInputElement>();

  const saveFormHandle = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      const df = {
        basket_items: Array.from(
          basketStore.basket.map(({ id, quantity }) => {
            return { id, quantity };
          })
        ), // only id & quantity
        amount: basketStore.basketTotalPrice,
        deliveryData: {
          country: countryRef?.current?.value,
          postcode: postcodeRef?.current?.value,
          city: cityRef?.current?.value,
          street: streetRef?.current?.value,
          firstName: firstNameRef?.current?.value,
          lastName: lastNameRef?.current?.value,
          tel: telRef?.current?.value,
          delInfo: delInfoRef?.current?.value,
        },
        invoiceData: {
          country: countryRefInv?.current?.value,
          postcode: postcodeRefInv?.current?.value,
          city: cityRefInv?.current?.value,
          street: streetRefInv?.current?.value,
          fullNameCompany: fullnameRefInv?.current?.value,
          tax: taxRefInv?.current?.value,
        },
        shipping: { name: selectedShipping, price: basketStore.shippingFees },
        payment: { name: selectedPayment, price: 0 },
      };
      const resp = await newOrder(df);
      if (resp.status === 200) {
        basketStore.setEmptyBasket();
        navigator('/checkout_success', { state: { orderId: resp.data.orderId } });
      }
    }

    setValidated(true);
  };

  const copyFomDelivery = () => {
    postcodeRefInv.current.value = postcodeRef.current.value;
    cityRefInv.current.value = cityRef.current.value;
    streetRefInv.current.value = streetRef.current.value;
    fullnameRefInv.current.value = firstNameRef.current.value + ' ' + lastNameRef.current.value;
  };
  const insertTempData = () => {
    postcodeRef.current.value = 123456;
    cityRef.current.value = 'Budapest';
    streetRef.current.value = 'My street';
    firstNameRef.current.value = 'User';
    lastNameRef.current.value = 'Tesztel';
    telRef.current.value = '+36544878';
    delInfoRef.current.value = 'Please call me';
    postcodeRefInv.current.value = postcodeRef.current.value;
    cityRefInv.current.value = cityRef.current.value;
    streetRefInv.current.value = streetRef.current.value;
    fullnameRefInv.current.value = firstNameRef.current.value + ' ' + lastNameRef.current.value;
    taxRefInv.current.value = 'BNhg-442435';
  };
  return (
    <Container fluid={'xxl'} className="m-0 ps-3 pe-3 ps-xxl-0 pe-xxl-0" datatype="checkout">
      <h3>
        CHECKOUT{' '}
        <Button
          size="sm"
          onClick={() => {
            insertTempData();
          }}>
          Fill
        </Button>
      </h3>
      <Row className="g-0">
        <Form noValidate validated={validated} onSubmit={saveFormHandle} style={{ display: 'contents' }}>
          <Col md className="basket_left_bar">
            <Row className="p-0 m-0 gap-3">
              <Card className="col-lg p-0 m-0">
                <Card.Header>
                  <h6>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-truck"
                      viewBox="0 0 16 16">
                      <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                    </svg>{' '}
                    Delivery address
                  </h6>
                </Card.Header>
                <Card.Body>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Country<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={countryRef} disabled required value={'Hungary'} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Postcode<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={postcodeRef} required type="number" maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Town / City<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={cityRef} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Number and street<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={streetRef} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      First Name<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={firstNameRef} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Last Name<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={lastNameRef} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Telephone number<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={telRef} required maxLength={30} placeholder="E.g: +36 70 6257755" />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Additional delivery info</InputGroup.Text>
                    <Form.Control ref={delInfoRef} maxLength={200} />
                  </InputGroup>
                </Card.Body>
              </Card>
              <Card className="col-lg p-0 m-0">
                <Card.Header>
                  <h6>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-receipt"
                      viewBox="0 0 16 16">
                      <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                      <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                    </svg>{' '}
                    Invoice address{' '}
                    <a
                      href="#"
                      onClick={() => {
                        copyFomDelivery();
                      }}>
                      Copy from Delivery
                    </a>
                  </h6>
                </Card.Header>
                <Card.Body>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Country<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={countryRefInv} required maxLength={30} defaultValue={'Hungary'} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Postcode <span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={postcodeRefInv} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Town / City<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={cityRefInv} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Number and street<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={streetRefInv} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      Full name / Company<span className="text-danger">*</span>
                    </InputGroup.Text>
                    <Form.Control ref={fullnameRefInv} required maxLength={30} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Tax №</InputGroup.Text>
                    <Form.Control ref={taxRefInv} maxLength={30} />
                  </InputGroup>
                </Card.Body>
              </Card>
            </Row>
            <Row className="m-0 mt-3" style={{ position: 'relative', overflow: 'hidden' }}>
              <h4 className="p-0">Select Payment Method</h4>
              <input
                type="radio"
                className="btn-check"
                name="payment-methods"
                id="bank"
                autoComplete="off"
                defaultChecked
                onChange={(e) => setSelectedPyment(e.target.id)}
              />
              <label className="btn btn-outline-warning text-start" htmlFor="bank">
                <span className="fw-bold">Bank transfer (0 HUF)</span>
                <br />
                <i>Payment via Bank Transfer. </i>
              </label>

              <input
                type="radio"
                className="btn-check mt-3"
                name="payment-methods"
                id="paypal"
                disabled
                autoComplete="off"
                onChange={(e) => setSelectedPyment(e.target.id)}
              />
              <label className="btn btn-outline-secondary text-start mt-1" htmlFor="paypal">
                PayPal
              </label>
              <input
                type="radio"
                className="btn-check mt-3"
                name="payment-methods"
                id="card"
                disabled
                autoComplete="off"
                onChange={(e) => setSelectedPyment(e.target.id)}
              />
              <label className="btn btn-outline-secondary text-start mt-1" htmlFor="card">
                Debit/Credit Card
              </label>
            </Row>
            <Row className="m-0 mt-3" style={{ position: 'relative', overflow: 'hidden' }}>
              <h4 className="p-0">Shipping options</h4>
              <input
                type="radio"
                className="btn-check"
                name="shipping-methods"
                id="standart"
                autoComplete="off"
                defaultChecked
                onChange={(e) => setSelectedShipping(e.target.id)}
              />
              <label className="btn btn-outline-secondary text-start" htmlFor="standart">
                <span className="fw-bold">Home Delivery (6 500 HUF)</span>
                <br />
                <i>We will choose the best delivery service for you.</i>
              </label>

              <input
                type="radio"
                className="btn-check mt-3"
                name="shipping-methods"
                id="post_box"
                disabled
                autoComplete="off"
                onChange={(e) => setSelectedShipping(e.target.id)}
              />
              <label className="btn btn-outline-secondary text-start mt-1" htmlFor="post_box">
                Post box
              </label>
            </Row>
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
              <Button disabled={basketStore.basket.length === 0} className="mt-3" type="submit">
                Place order
              </Button>
              <div className="rounded border p-3 mt-3">
                By placing your order you accept and agree to our{' '}
                <NavLink to={'/genterms'} style={{ textDecoration: 'none' }}>
                  General Terms & Conditions (GTC)
                </NavLink>{' '}
                and have also taken note of our{' '}
                <NavLink to={'/privacypolicy'} style={{ textDecoration: 'none' }}>
                  Privacy Policy and Right of Withdrawal Policy
                </NavLink>
                .
              </div>
            </div>
          </Col>
        </Form>
      </Row>
    </Container>
  );
};

export default observer(CheckoutPage);
