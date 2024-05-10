import { observer } from 'mobx-react-lite';
import { Button } from 'react-bootstrap';
import productStore from '../stores/productStore';
import { useSearchParams } from 'react-router-dom';
import { BrandInterface } from '../common/types';
import { regexName } from '../common/utils';

const BrandBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const clickHandler = (brand: BrandInterface) => {
    if (brand.id === productStore.selectedBrand?.id) {
      productStore.setSelectedBrand(null);
      searchParams.delete('brand');
    } else {
      productStore.setSelectedBrand(brand);
      searchParams.set('brand', regexName(brand.name, '-'));
    }
    productStore.setPage(1);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  return (
    <div className="d-flex mb-3 flex-wrap g-3 brand_list" style={{ gap: 10 }}>
      {productStore.brands.map((brand) => (
        <Button
          key={brand.id}
          variant="outline-primary"
          className="p-2 flex-fill"
          onClick={() => clickHandler(brand)}
          active={productStore.selectedBrand ? brand.id === productStore.selectedBrand.id : false}>
          {brand.name}
        </Button>
      ))}
    </div>
  );
};

export default observer(BrandBar);
