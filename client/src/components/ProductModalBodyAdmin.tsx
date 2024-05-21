import StarRating from '../ui/rating/stars';
import ProducInfoAdmin from './ProductInfoAdmin';
import { ProductInterface } from '../common/types';
import { useState, useEffect, useRef } from 'react';
import { Form, Row, InputGroup, Col, Button, Modal, Image as Img } from 'react-bootstrap';
import adminStore from '../stores/adminStore';
import { getType } from '../api/typesApi';
import { observer } from 'mobx-react-lite';
import { AxiosError, isAxiosError } from 'axios';
import { createProduct, updateProduct } from '../api/productsApi';

interface ModalBodyProps {
  data: ProductInterface | null;
  onSave(): void;
}

const serverUrl = `${window.location['protocol']}//${process.env.VITE_SERVER_HOST}:` + process.env.VITE_SERVER_PORT;

const getImage = async (imgPath: string | File) => {
  const response = await fetch(serverUrl + '/static/' + imgPath);
  const data = await response.blob();
  const file = new File([data], imgPath as string, { type: data.type });
  return file;
};

const ProductModalBody: React.FC<ModalBodyProps> = ({ data, onSave }) => {
  const allowedImageFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  const [error, setError] = useState('');
  const [name, setName] = useState(data && data.name ? data.name : '');
  const [img, setimage] = useState<File | null>(null);
  const [price, setPrice] = useState(data && data.price ? data.price : 0);
  const [rating, setRating] = useState(data && data.rating ? data.rating : 0);
  const [brandId, setBrandId] = useState(data && data.brandId ? data.brandId : '');
  const [typeId, setTypeId] = useState(data && data.typeId ? data.typeId : '');
  const [imageData, setImageData] = useState({});
  const [info, setInfo] = useState(data && data.info ? data.info : []);

  const [validated, setValidated] = useState(false);

  function HandleAxiosError(err: Error | AxiosError) {
    if (isAxiosError(err)) {
      console.error('axiosError: ', err);
      setError(err.response ? err.response?.data.message : err.message);
    } else {
      setError(err.message);
      console.error('NOT axiosError: ', err);
    }
  }

  const saveFormHandle = async (event: Event) => {
    if (!imageData || !allowedImageFormats.includes(imageData['type'])) return;
    const form = event.currentTarget as HTMLFormElement;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    const productData: Omit<ProductInterface, 'info'> & { info: string | null } = {
      typeId: Number(typeId),
      brandId: Number(brandId),
      name: String(name),
      price: Number(price),
      img,
      rating,
      info: info.length > 0 ? JSON.stringify(info) : null,
    };
    const formData = new FormData();
    for (const key in productData) formData.append(key, productData[key]);
    if (!data) {
      createProduct(formData)
        .then(({ data }) => {
          console.log('data: ', data);
          adminStore.addNewProduct(data);
          onSave();
        })
        .catch((err: Error | AxiosError) => HandleAxiosError(err));
    } else {
      updateProduct(data.id!, formData)
        .then(({ data }) => {
          adminStore.updateProduct(data);
          onSave();
        })
        .catch((err: Error | AxiosError) => HandleAxiosError(err));
    }
    setValidated(true);
  };
  const upload = useRef();

  const uploadImageHandler = () => {
    //@ts-ignore
    upload.current.click();
  };

  useEffect(() => {
    if (data && data.img) {
      getImage(data.img)
        .then((res) => setimage(res))
        .catch((e) => console.log(e));
    }
  }, []);

  useEffect(() => {
    if (!img) return;
    const image = new Image();
    const url = URL.createObjectURL(img);
    image.src = url;
    image.onload = () => {
      const imgSize =
        img.size / 1048576 >= 0.1 ? (img.size / 1048576).toFixed(2) + ' MB' : (img.size / 1024).toFixed(2) + ' Kb';
      setImageData({ type: img.type, size: imgSize, dimensions: image.width + ' x ' + image.height });
    };
  }, [img]);

  const onTypeSelect = async (id: number) => {
    setTypeId(id);
    const type = await getType(id);
    if (type) {
      adminStore.setBrands(type.brands);
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={saveFormHandle}>
        <Row className="p-0 m-0 mb-3 gap-3">
          <InputGroup className="col-sm p-0 m-0">
            <InputGroup.Text>Type:</InputGroup.Text>
            <Form.Select
              required
              size="sm"
              onChange={(e) => onTypeSelect(Number(e.target.value))}
              value={typeId}
              name="type_id">
              <option value={''} disabled>
                Select type...
              </option>
              {adminStore.types &&
                adminStore.types.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.name}
                  </option>
                ))}
            </Form.Select>
          </InputGroup>
          <InputGroup className="col-sm p-0 m-0">
            <InputGroup.Text>Brand:</InputGroup.Text>
            <Form.Select
              required
              size="sm"
              onChange={(e) => setBrandId(e.target.value)}
              defaultValue={brandId}
              name="brand_id"
              disabled={typeId === ''}>
              <option disabled value={''}>
                Select brand...
              </option>
              {adminStore.brands &&
                adminStore.brands.map((b) => (
                  <option value={b.id} key={b.id}>
                    {b.name}
                  </option>
                ))}
            </Form.Select>
          </InputGroup>
        </Row>
        <InputGroup className="mb-3">
          <InputGroup.Text className="col-2">Name:</InputGroup.Text>
          <Form.Control
            required
            size="sm"
            type="text"
            placeholder="Product name"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            name="name"
          />
        </InputGroup>
        <Row className="p-0 m-0 mb-3 gap-3">
          <InputGroup className="col-sm p-0 m-0">
            <InputGroup.Text className="col-2">Price:</InputGroup.Text>
            <Form.Control
              required
              size="sm"
              type="number"
              placeholder="Product name"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              name="price"
            />
            <InputGroup.Text>HUF</InputGroup.Text>
          </InputGroup>
          <InputGroup className="col-sm p-0 m-0">
            <InputGroup.Text>Rating:</InputGroup.Text>
            <Form.Control
              size="sm"
              type="number"
              step={0.1}
              min={0}
              max={5}
              placeholder="Product name"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              name="rating"
            />
            <InputGroup.Text>
              <StarRating rating={(rating / 5) * 100} />
            </InputGroup.Text>
          </InputGroup>
        </Row>

        <Row className="p-0 m-0 mb-3 gap-3 align-items-center">
          <Col sm="auto">
            <Button
              onClick={uploadImageHandler}
              style={{ width: 200, height: 200 }}
              title="Click to Upload Image"
              className="border-0 p-0"
              variant="light">
              {img ? (
                <Img src={URL.createObjectURL(img)} thumbnail rounded style={{ maxHeight: 200 }} />
              ) : (
                'Upload Image'
              )}
            </Button>
          </Col>

          <Col sm>
            {imageData &&
              Object.keys(imageData).map((key) => (
                <div className="mb-1" key={key}>
                  {key} : {imageData[key]}{' '}
                  {key === 'type' && !allowedImageFormats.includes(imageData[key]) && (
                    <span className="badge text-bg-danger">type NOT Allowed!</span>
                  )}
                </div>
              ))}

            <InputGroup className="mb-3">
              <Form.Control
                size="sm"
                type="file"
                name="image"
                ref={upload}
                placeholder="Select Imange"
                onChange={(e) => setimage(e.target.files[0])}
                accept="image/*"
                multiple={false}
              />
              <Button onClick={uploadImageHandler}>Upload</Button>
            </InputGroup>
            <div className="fs-11">
              Allowed Image types:
              <br /> {allowedImageFormats.join(', ')}
            </div>
          </Col>
        </Row>
        <h6>Specifications:</h6>
        <ProducInfoAdmin addProductInfo={setInfo} data={info} />
        {error && (
          <div style={{ color: 'red' }} className="mt-3">
            ERROR: {error}
          </div>
        )}
        <Modal.Footer className="p-0 pt-3 mt-3">
          <Button
            variant="primary"
            type="submit"
            disabled={!(imageData && allowedImageFormats.includes(imageData['type']))}>
            SUBMIT
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
};

export default observer(ProductModalBody);
