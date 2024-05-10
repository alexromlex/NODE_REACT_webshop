import { useState } from 'react';
import adminStore from '../stores/adminStore';
import { Card, Form, InputGroup, Modal, Row, Button } from 'react-bootstrap';

interface ModalTypeBodyAdminProps {
    data: any;
    onSave(): void;
}

const ModalTypeBodyAdmin: React.FC<ModalTypeBodyAdminProps> = ({ data, onSave }) => {
    const [typeName, setTypeName] = useState(data && data.name ? data.name : '');
    const [error, setError] = useState('');
    const [brandsSelected, setBrandsSelected] = useState(data ? data.brands.map((b) => b.id) : []);
    const [brandsQuery, setBrandsQuery] = useState(adminStore.brands);

    const onSaveHandler = async () => {
        if (typeName === '') {
            setError("Name can't be empty!");
            return;
        }
        const resp = !data ? await adminStore.createType(typeName, brandsSelected) : await adminStore.updateType(data.id, typeName, brandsSelected);
        if (resp.status === 200) {
            onSave();
        } else {
            setError(resp.data.message);
        }
    };

    const brandClickHandler = (e) => {
        if (e.target.checked) {
            setBrandsSelected((brands) => [...brands, Number(e.target.value)]);
        } else {
            setBrandsSelected(brandsSelected.filter((b) => b !== Number(e.target.value)));
        }
    };

    const searchOnChangeHandler = (v: string) => {
        if (!v) {
            setBrandsQuery(adminStore.brands);
        } else {
            const newQuery = adminStore.brands.filter((el) => el.name.toLowerCase().includes(v.toLowerCase()));
            setBrandsQuery(newQuery);
        }
    };

    return (
        <>
            <Form.Control size="sm" type="text" placeholder="Type name" value={typeName} autoFocus onChange={(e) => setTypeName(e.target.value)} />
            <Card className="p-3 mt-3">
                <Row>
                    <h6 className="col-sm-6">SELECT BRANDS</h6>
                    <div className="col-sm-6 d-flex justify-content-between gap-3">
                        <InputGroup size="sm" className="">
                            <InputGroup.Text id="inputGroup-sizing-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                placeholder="Search brand..."
                                onChange={(e) => {
                                    searchOnChangeHandler(e.target.value);
                                }}
                            />
                        </InputGroup>
                    </div>
                </Row>
                <Card.Body>
                    {brandsQuery.map((brand) => (
                        <Form.Check key={brand.id} inline label={brand.name} name="group1" value={brand.id} type={'checkbox'} id={`brand-${brand.id}`} checked={brandsSelected.includes(brand.id)} onChange={(e) => brandClickHandler(e)} />
                    ))}
                </Card.Body>
            </Card>
            {error && (
                <div style={{ color: 'red' }} className="mt-3">
                    {error}
                </div>
            )}
            <Modal.Footer className="p-0 pt-3 mt-3">
                <Button
                    variant="primary"
                    onClick={() => {
                        onSaveHandler();
                    }}
                >
                    SAVE
                </Button>
            </Modal.Footer>
        </>
    );
};
export default ModalTypeBodyAdmin;
