import { useEffect, useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { getProducts } from '../api/productsApi';
import { NavLink } from 'react-router-dom';
const limit = 30;
const SearchBarDropDown = () => {
  const [found, setFound] = useState([]);
  const [menuShow, setMenuShow] = useState(false);

  const searchInputHandler = useDebouncedCallback(async (v: string) => {
    if (!v) {
      setMenuShow(false);
      setFound([]);
      return;
    }
    getProducts(null, null, 1, limit, null, v)
      .then(({ data }) => {
        if (data.rows.length === 0) {
          setMenuShow(false);
          setFound([]);
          return;
        }
        setFound(data.rows);
        setMenuShow(true);
      })
      .catch((error) => console.error(error));
  }, 1000);

  useEffect(() => {
    if (found.length > 0 && !menuShow) setMenuShow(true);
  }, [found, menuShow]);
  return (
    <>
      <Dropdown className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-0"
          aria-label="Search"
          onChange={(e) => searchInputHandler(String(e.target.value))}
        />
        <Dropdown.Menu
          //  as={CustomMenu}
          show={menuShow}
          className={menuShow ? 'show' : ''}
          align={'end'}>
          {found.map((p) => (
            <NavLink to={'/product/' + p.id} className={'dropdown-item'} key={p.id}>
              {p.name}
            </NavLink>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default SearchBarDropDown;
