import { useState } from 'react';
import { Button, Col, Row, Form, Container } from 'react-bootstrap';
import ButtonDelete from '../ui/buttons/delete';
import { ProductInfoInterface } from '../common/types';

interface ProducInfoAdminProps {
  addProductInfo(data: ProductInfoInterface[]): void;
  data?: ProductInfoInterface[];
}
const ProducInfoAdmin: React.FC<ProducInfoAdminProps> = (props) => {
  const [data, setData] = useState(props && props.data ? props.data : []);
  const [title, setName] = useState('');
  const [description, setDesc] = useState('');

  const addDataHandler = () => {
    const new_row = [{ title, description }];
    const newData = [...data, ...new_row];
    setData(newData);
    props.addProductInfo(newData);
    setName('');
    setDesc('');
  };

  const removeItemHandler = (indx: number) => {
    const new_data = [...data];
    new_data.splice(indx, 1);
    setData(new_data);
    props.addProductInfo(new_data);
  };

  return (
    <>
      <Row className="p-0 m-0 gap-3">
        <Col sm className="p-0 m-0">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Col>
        <Col sm className="p-0 m-0">
          <Form.Control
            as="textarea"
            rows={1}
            size="sm"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </Col>
        <Col sm="auto">
          <Button size="sm" onClick={addDataHandler} disabled={title && description ? false : true}>
            + add
          </Button>
        </Col>
      </Row>
      {data && (
        <Container className="mt-3">
          {data.map((row, indx) => (
            <Row key={indx} className={`p-0 m-0 gap-3 pt-3 mb-3 mt-3 ${indx > 0 && 'border-top'}`}>
              <Col sm className="p-0 m-0">
                {row.title}
              </Col>
              <Col sm className="p-0 m-0">
                {row.description}
              </Col>
              <Col sm="auto" className="p-0 m-0">
                <ButtonDelete size="sm" onClickHandler={() => removeItemHandler(indx)} />
              </Col>
            </Row>
          ))}
        </Container>
      )}
    </>
  );
};

export default ProducInfoAdmin;
