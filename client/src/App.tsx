import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import ToastContainer from './ui/toast/ToastContainer';
import ModalWindow from './ui/modal';
import { useEffect, useState } from 'react';
import { userCheckAuth } from './api/userApi';
import userStore from './stores/userStore';
import basketStore from './stores/basketStore';
import mainStore from './stores/mainStore';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  // console.log('[App] called!');
  const [userchecking, setUserChecking] = useState(true);

  useEffect(() => {
    userCheckAuth()
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        const decoded: Record<string, any> = jwtDecode(data.token);
        userStore.setUser({ id: decoded.id, role: decoded.role, email: decoded.email });
        userStore.setAuth(true);
      })
      .catch(() => {})
      .finally(() => {
        setUserChecking(false);
        basketStore.getBasket(userStore.user?.id);
      });
    mainStore.getSettings();
  }, []);

  return (
    !userchecking && (
      <>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <AppRouter />
        </BrowserRouter>
        <ToastContainer />
        <ModalWindow />
      </>
    )
  );
};

export default App;
