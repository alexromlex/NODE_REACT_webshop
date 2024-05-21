import { Container } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
interface CompProps {
  title: string;
  data: string;
}
const HtmlPageComponent: React.FC<CompProps> = ({ title, data }) => {
  const dataRef = useRef(null);
  useEffect(() => {
    if (data && dataRef) {
      //@ts-ignore
      dataRef.current.innerHTML = data;
    }
  }, [data, dataRef]);
  return (
    <Container fluid className="p-3 m-0">
      {title && <h1>{title}</h1>}
      <div ref={dataRef}></div>
    </Container>
  );
};

export default HtmlPageComponent;
