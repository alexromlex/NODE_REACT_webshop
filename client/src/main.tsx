import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { StoreProvider} from './stores/StoreProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <App />
  </StoreProvider>
  
  // <React.StrictMode>

  // </React.StrictMode>,
);
