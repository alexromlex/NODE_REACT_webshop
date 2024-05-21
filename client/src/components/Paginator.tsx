import React, { useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

interface PagesComponentProps {
  totalPages: number;
  limitPages: number;
}

const PagesComponent: React.FC<PagesComponentProps> = ({ totalPages, limitPages }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [searchParams, setSearchParams] = useSearchParams();
  let currentPage = Number(searchParams.get('page'));
  if (currentPage === 0) currentPage = 1;

  useEffect(() => {
    searchParams.set('page', String(currentPage));
    setSearchParams(searchParams);
  }, [searchParams]);

  const setPageHandler = (page: number) => {
    searchParams.set('page', String(page));
    setSearchParams(searchParams);
  };

  return (
    <Pagination className="m-0">
      {pages.map((page, indx) => {
        if (indx === 0 && page < currentPage - 1) {
          return <Pagination.First key={indx} onClick={() => setPageHandler(page)} />;
        }

        if (currentPage - 4 < indx + 1 && currentPage + 4 > indx + 1) {
          if (currentPage - 4 === indx || currentPage + 2 === indx) {
            return <Pagination.Ellipsis key={indx} />;
          }
          return (
            <Pagination.Item active={page === currentPage} key={indx} onClick={() => setPageHandler(page)}>
              {page}
            </Pagination.Item>
          );
        }
        if (indx === pages.length - 1 && page > currentPage + 1) {
          return <Pagination.Last key={indx} onClick={() => setPageHandler(page)} />;
        }
      })}
    </Pagination>
  );
};

export default PagesComponent;
