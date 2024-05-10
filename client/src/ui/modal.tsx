import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CallableFunc } from '../common/types';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

export interface ModalActionInterface {
    title: string;
    body: JSX.Element;
    action: { name: string; handler: CallableFunc | null };
    modalProps: { modalShow: boolean; onHide: CallableFunc };
}

export interface ModalInterface {
    title: string;
    body: JSX.Element | null;
    action?: ModalActionInterface;
}

const ModalWindow = (props) => {
    return (
        <Modal {...props.modalProps} enforceFocus={false}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.body}
                {props.children}
            </Modal.Body>
            {props.action?.handler && (
                <Modal.Footer>
                    <Button variant="primary" onClick={props.action?.handler}>
                        {props.action?.name}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default ModalWindow;
