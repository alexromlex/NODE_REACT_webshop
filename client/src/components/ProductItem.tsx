import { ProductInterface } from '../common/types';
import { Col, Card } from 'react-bootstrap';
import StarRating from '../ui/rating/stars';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../api/http';

interface ProductItemProps {
  product: ProductInterface;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const navigate = useNavigate();
  const productClickHandler = () => {
    navigate('/product/' + product.id, { state: { productId: product.id } });
  };
  return (
    <Col>
      <Card className="p-0 product_card" onClick={() => productClickHandler()}>
        <Card.Img
          variant="top"
          src={serverUrl + '/static/' + product.img}
          style={{ width: 'auto', objectFit: 'contain' }}
          height={300}
          alt={product.name}
        />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <div>
            <span className="badge text-bg-primary">{product.brand!.name}</span>
            <span className="badge text-bg-secondary ms-1">{product.type!.name}</span>
          </div>
          <Card.Text>{product.price.toLocaleString('hu-HU')} HUF</Card.Text>
          <StarRating rating={(product.rating! / 5) * 100} />
          <Card.Text className="productDescription">
            {product.info &&
              Array.from(
                product.info?.map((i) => {
                  return String(i.title + ': ' + i.description);
                })
              ).join(', ')}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
