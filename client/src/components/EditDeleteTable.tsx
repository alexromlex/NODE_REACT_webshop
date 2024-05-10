import { Image, Stack, Table, Modal, Button } from 'react-bootstrap';
import ButtonEdit from '../ui/buttons/edit';
import ButtonDelete from '../ui/buttons/delete';
import { getPropByString } from '../common/utils';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
interface EditDeleteProps {
  rows: any[];
  cols: { name: string; alias?: string; formatter?: any }[]; // name = 'order.invoice.id' will return id by getPropByString()
  onEdit(obj: object): void;
  onDelete(id: number): void;
}
const EditDeleteTable: React.FC<EditDeleteProps> = (props) => {
  const serverUrl = `${window.location['protocol']}//${process.env.VITE_SERVER_HOST}:` + process.env.VITE_SERVER_PORT;
  const [showModal, setShowModal] = useState(false);
  const [delId, setDelId] = useState(null);
  const onDeleteHandler = (id: number) => {
    setShowModal(true);
    setDelId(id);
  };
  return (
    <>
      <Table responsive className="tables">
        <thead>
          <tr>
            {props.cols.map((col) => (
              <th className="align-middle" key={col.name + 'th'}>
                {col.alias ? col.alias : col.name}
              </th>
            ))}
            <th className="col-1"></th>
          </tr>
        </thead>
        <tbody>
          {props.rows &&
            props.rows.map((t) => (
              <tr key={'row_' + t.id} title={`ID: ${t.id}`}>
                {props.cols.map((col, indx) => (
                  <td className="align-middle" key={t[col.name] + 'td_' + indx}>
                    {col.name === 'img' ? (
                      <Image src={serverUrl + '/static/' + t[col.name]} rounded thumbnail style={{ maxHeight: 100 }} />
                    ) : Array.from(col.name).includes('.') ? (
                      col.formatter ? (
                        col.formatter(getPropByString(t, col.name))
                      ) : (
                        getPropByString(t, col.name)
                      )
                    ) : col.formatter ? (
                      col.formatter(t[col.name])
                    ) : (
                      t[col.name]
                    )}
                  </td>
                ))}
                <td className="align-middle">
                  <Stack direction="horizontal" gap={2}>
                    <ButtonEdit onClickHandler={() => props.onEdit(t)} />
                    <ButtonDelete onClickHandler={() => onDeleteHandler(t.id)} />
                  </Stack>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete id: {delId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this data?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.onDelete(delId);
              setShowModal(false);
              setDelId(null);
            }}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default observer(EditDeleteTable);
