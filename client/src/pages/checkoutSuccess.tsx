import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import userStore from '../stores/userStore';

const CheckoutSuccess = () => {
    const location = useLocation();
    const OrderId = location.state && location.state.orderId ? location.state.orderId : undefined;
    const navigator = useNavigate();
    useEffect(() => {
        if (!OrderId) {
            navigator('/');
        }
    }, []);
    return (
        <>
            <Row className="rounded p-3 m-3 d-flex justify-content-center bg-success bg-opacity-25">
                <div className="text-center">Dear {userStore.user?.name ? userStore.user.name : 'User'}, your order has been successfully placed with number:</div>
                <div className="fw-bold text-center">{OrderId}</div>
            </Row>
            <Row className="m-3 justify-content-center d-flex g-3">
                <Col xs="auto">
                    <Button
                        onClick={() => {
                            navigator('/orders');
                        }}
                    >
                        My orders
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button
                        onClick={() => {
                            navigator('/');
                        }}
                    >
                        Continue shopping
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default CheckoutSuccess;
