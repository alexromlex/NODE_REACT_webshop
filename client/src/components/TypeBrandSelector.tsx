import { Row, InputGroup, Form } from 'react-bootstrap';
import adminStore from '../stores/adminStore';
import { useSearchParams } from 'react-router-dom';
import { regexName } from '../common/utils';
import { observer } from 'mobx-react-lite';

const TypeBrandSelector = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSelectType = (id: number) => {
    if (id < 0) {
      searchParams.delete('type');
      adminStore.setSelectedType(null);
    }
    const find_type_indx = adminStore.types.findIndex((i) => i.id === id);
    if (find_type_indx > -1) {
      searchParams.set('type', regexName(adminStore.types[find_type_indx].name, '-'));
      searchParams.set('page', '1');
      adminStore.setSelectedType(adminStore.types[find_type_indx]);
    }
    setSearchParams(searchParams);
  };
  const onSelectBrand = (id: number) => {
    // console.log('setBrandId id: ', id);
    if (id < 0) {
      searchParams.delete('brand');
      adminStore.setSelectedBrand(null);
    }
    const find_brand_indx = adminStore.brands.findIndex((i) => i.id === id);
    if (find_brand_indx > -1) {
      searchParams.set('brand', regexName(adminStore.brands[find_brand_indx].name, '-'));
      searchParams.set('page', '1');
      adminStore.setSelectedBrand(adminStore.brands[find_brand_indx]);
    }
    setSearchParams(searchParams);
  };

  return (
    <Row className="p-0 m-0 mb-3 gap-3 mt-3">
      <InputGroup className="col-sm p-0 m-0" size="sm">
        <InputGroup.Text>Type:</InputGroup.Text>
        <Form.Select
          required
          size="sm"
          value={adminStore.selectedType ? adminStore.selectedType.id : -1}
          name="type_id"
          onChange={(e) => {
            onSelectType(Number(e.target.value));
          }}>
          <option value={-1}>All types...</option>
          {adminStore.types &&
            adminStore.types.map((t) => (
              <option value={t.id} key={t.id}>
                {t.name}
              </option>
            ))}
        </Form.Select>
      </InputGroup>
      <InputGroup className="col-sm p-0 m-0" size="sm">
        <InputGroup.Text>Brand:</InputGroup.Text>
        <Form.Select
          required
          size="sm"
          onChange={(e) => onSelectBrand(Number(e.target.value))}
          value={adminStore.selectedBrand ? adminStore.selectedBrand.id : -1}
          name="brand_id">
          <option value={-1}>All brands...</option>
          {adminStore.brands &&
            adminStore.brands.map((b) => (
              <option value={b.id} key={b.id}>
                {b.name}
              </option>
            ))}
        </Form.Select>
      </InputGroup>
    </Row>
  );
};

export default observer(TypeBrandSelector);
