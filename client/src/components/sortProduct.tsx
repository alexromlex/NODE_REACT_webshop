import { useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import productStore from '../stores/productStore';
import { useSearchParams } from 'react-router-dom';

const SortProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState('Sort by ');
  const titles = {
    'Price Low to Hight': ['price', 'ASC'],
    'Price Hight to Low': ['price', 'DESC'],
    'Top Rated': ['rating', 'DESC'],
    'cancel filter': ['updatedAt', 'DESC'],
  };
  const filterHandler = (eventKey: string, event: object) => {
    productStore.setSearchSort(titles[eventKey]);
    searchParams.set('sort', titles[eventKey].join(','));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
    setTitle(eventKey === 'cancel filter' ? 'Sort by ' : 'Sorted by: ' + eventKey);
  };

  return (
    <DropdownButton
      as={ButtonGroup}
      size="sm"
      variant="outline-secondary"
      title={title}
      onSelect={(eventKey, event) => {
        filterHandler(eventKey, event);
      }}>
      {Object.keys(titles).map((key, indx) => (
        <Dropdown.Item eventKey={key} key={indx}>
          {key}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default SortProduct;
