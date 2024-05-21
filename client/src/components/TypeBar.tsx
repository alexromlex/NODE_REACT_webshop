import { observer } from 'mobx-react-lite';
import { ListGroup } from 'react-bootstrap';
import productStore from '../stores/productStore';
import { getType } from '../api/typesApi';
import { useSearchParams } from 'react-router-dom';
import { regexName } from '../common/utils';
import { TypeInterface } from '../common/types';
import { useEffect } from 'react';

const TypeBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const clickHandler = (type: TypeInterface) => {
    if (type.id === productStore.selectedType?.id) {
      productStore.setSelectedType(null);
      searchParams.delete('type');
    } else {
      productStore.setSelectedType(type);
      getType(type.id).then((type) => {
        productStore.setBrands(type.brands);
        // CANCEL SELECTED BRAND IF IT NOT ASSOCIATES WITH SELECTED TYPE
        if (
          productStore.selectedBrand &&
          !Array.from(productStore.brands, (brand) => brand.id).includes(productStore.selectedBrand?.id)
        ) {
          productStore.setSelectedBrand(null);
        }
      });
      searchParams.set('type', regexName(type.name, '-'));
    }
    productStore.setPage(1);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  useEffect(() => {
    return () => {
      productStore.setSelectedType(null);
    };
  }, []);
  return (
    <ListGroup className="types_list mb-3">
      {productStore.types.map((type) => (
        <ListGroup.Item
          action
          active={productStore.selectedType ? type.id === productStore.selectedType.id : false}
          key={type.id}
          onClick={() => clickHandler(type)}>
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default observer(TypeBar);
