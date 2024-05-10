import ToastObj from './ToastObj';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { observer } from 'mobx-react-lite';
import userStore from '../../stores/userStore';

const ToastsContainer = () => {
    return (
        <ToastContainer
            className="p-3"
            position={'top-end'}
            data-animation={true}
            style={{ position: 'fixed' }}
        >
            {userStore.toasts.map((toast) => (
                <ToastObj key={toast.id} toast={toast} />
            ))}
        </ToastContainer>
    );
};

export default observer(ToastsContainer);
