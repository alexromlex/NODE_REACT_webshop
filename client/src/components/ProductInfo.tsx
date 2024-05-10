import React from 'react';
import { Accordion } from 'react-bootstrap';
import { ProductInfoInterface } from '../common/types';

interface ProductInfoProps {
  id: number;
  name: string;
  data: ProductInfoInterface[] | undefined;
  opened: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ id, name, data, opened }) => {
  return (
    <>
      {data!.length > 0 && (
        <Accordion defaultActiveKey={opened ? id.toString() : null} className="productInfo-accordion">
          <Accordion.Item eventKey={id.toString()}>
            <Accordion.Header>{name}</Accordion.Header>
            <Accordion.Body>
              {data!.map((i) => (
                <div className="row info_row mb-3" key={i.id}>
                  <div className="col-auto title fs-8">{i.title}:</div>
                  <div className="col description">{i.description}</div>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
};

export default ProductInfo;
