import Toast from 'react-bootstrap/Toast';
import { FunctionComponent, useState } from 'react';
import userStore from '../../stores/userStore';
import { ToastObjInterface } from '../../common/types';

// https://react-bootstrap.netlify.app/docs/components/toasts
const Icon = (svg_color: string): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={svg_color} className="bi bi-check-square me-1" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
    </svg>
);

const toastStyles = {
    primary: { text_color: 'text-white', svg_color: 'blue' },
    secondary: { text_color: 'text-white', svg_color: 'gray' },
    success: { text_color: 'text-white', svg_color: 'green' },
    danger: { text_color: 'text-white', svg_color: 'red' },
    warning: { text_color: 'text-black', svg_color: 'red' },
    info: { text_color: 'text-black', svg_color: 'dark' },
    light: { text_color: 'text-black', svg_color: 'dark' },
    dark: { text_color: 'text-white', svg_color: 'dark' },
};

interface Props {
    toast: ToastObjInterface;
}

const ToastObj: React.FC<Props> = ({ toast }) => {
    const [show, setShow] = useState(true);
    const [autohide, setAutohide] = useState(toast.delay > 0);

    const handleMouseLeave = (): void => {
        if (toast.delay > 0) setAutohide(true);
    };
    const handleMouseEnter = (): void => {
        setAutohide(false);
    };

    return (
        <Toast
            animation={true}
            show={show}
            bg={toast.style}
            onClose={() => {
                setShow(false);
                userStore.removeToast(toast.id);
            }}
            delay={toast.delay}
            autohide={autohide}
            className={'sh'}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
        >
            <Toast.Header>
                {Icon(toastStyles[toast.style].svg_color)}
                <strong className="me-auto">{toast.title}</strong>
                <small>{toast.time}</small>
            </Toast.Header>
            <Toast.Body className={toastStyles[toast.style].text_color}>{toast.body}</Toast.Body>
        </Toast>
    );
};

export default ToastObj;
