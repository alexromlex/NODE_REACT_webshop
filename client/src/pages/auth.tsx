import { Button, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { userLogin, userRegistration } from '../api/userApi';
import userStore from '../stores/userStore';
import basketStore from '../stores/basketStore';
import { jwtDecode } from 'jwt-decode';

export interface LoginInterface {
  email: string;
  pass: string;
}
interface AuthPageProps {
  returnUrl?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ returnUrl }) => {
  const location = useLocation();
  const registerForm = location.pathname === '/register';
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const loginHandler = async (params: LoginInterface) => {
    setError(null);
    if (registerForm) {
      userRegistration(params.email, params.pass)
        .then(({ data }) => {
          localStorage.setItem('token', data.token);
          const decoded: Record<string, any> = jwtDecode(data.token);
          userStore.setUser({ id: decoded.id, role: decoded.role, email: decoded.email });
          userStore.setAuth(true);
          if (returnUrl) return navigate(returnUrl);
          navigate('/');
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    } else {
      userLogin(params.email, params.pass)
        .then(({ data }) => {
          localStorage.setItem('token', data.token);
          const decoded: Record<string, any> = jwtDecode(data.token);
          userStore.setUser({ id: decoded.id, role: decoded.role, email: decoded.email });
          userStore.setAuth(true);
          basketStore.getBasket(userStore.user?.id);
          if (returnUrl) return navigate(returnUrl);
          navigate('/');
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: window.innerHeight - 300 }}>
      <Card className="p-0 " style={{ width: 400 }}>
        <Card.Header>{!registerForm ? 'LOGIN' : 'REGISTRATION'}</Card.Header>
        <Card.Body>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          {error && (
            <Card.Text style={{ color: 'red' }} className="mt-3">
              {error}
            </Card.Text>
          )}
          <div className="row mt-3">
            <div className="col d-flex align-items-center">
              {registerForm ? <NavLink to={'/login'}>Login</NavLink> : <NavLink to={'/register'}>Registration</NavLink>}
            </div>
            <div className="col-auto">
              <Button variant="primary" onClick={() => loginHandler({ email, pass })}>
                {!registerForm ? 'LOGIN' : 'REGISTRATION'}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthPage;
