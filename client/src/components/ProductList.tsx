import { useEffect, useState } from 'react';
import { Row, Button } from 'react-bootstrap';
import ProductItem from './ProductItem';
import { getProducts } from '../api/productsApi';
import { promiseWrapper } from '../common/utils';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router-dom';
import productStore from '../stores/productStore';
import { ProductInterface } from '../common/types';

interface PropsInterface {
  type: number | null;
  brand: number | null;
  page: number;
  limit: number;
  sort: string[] | null;
  v: string | null; // search product string
}

const ProductList: React.FC<PropsInterface> = ({ type, brand, page, limit, sort, v }) => {
  const [data, setData] = useState(null);
  const navigator = useNavigate();
  useEffect(() => {
    const data = promiseWrapper(
      getProducts(type, brand, page, limit, sort, v).then(({ data }) => {
        productStore.setTotalPages(data.count);
        return data;
      }),
      0
    );
    setData(data);
  }, [type, brand, page, limit, sort, v]);
  return !data ? (
    data
  ) : data.rows.length > 0 ? (
    <Row xs={1} sm={2} md={3} lg={3} className="g-4">
      {data.rows.map((product: ProductInterface) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </Row>
  ) : (
    <div className="p-0 m-0">
      <div className="text-center bg-warning bg-opacity-25 rounded p-3 m-0">Sorry! No Products Found</div>
      {userStore.isAuth && userStore.user?.role === 'ADMIN' && (
        <Row className="d-flex justify-content-center mt-3">
          <Button onClick={() => navigator('/admin/products')} className="w-auto">
            Let's Upload!
          </Button>
        </Row>
      )}
    </div>
  );
};

export default ProductList;
