import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import './reset.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Test from './pages/Test';
import Login from './pages/Login/Login';
import ResetPassword from './pages/ResetPassword';
import Signup from './pages/Signup';
import NotFound from 'pages/NotFound';
import Layout from 'components/Layout';
import { store } from './store';
import TermsAgreement from 'pages/Signup/TermsAgreement';
import Call from './pages/Call';
import App from './App';
import { PrivateRouter } from './components/PrivateRoute/PrivateRouter';
import Confirm from 'pages/Confirm';
import PrivatePolicy from './pages/PrivatePolicy/PrivatePolicy';
import TermsOfUse from './pages/TermsOfUse/TermsOfUse';
import { routes } from './utils/routes';

export const router = createBrowserRouter([
  {
    path: '/calls',
    element: <Call />,
  },
  {
    path: '/private/policy',
    element: <PrivatePolicy />,
  },
  {
    path: '/term',
    element: <TermsOfUse />,
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: 'accounts/reset_password',
    element: <ResetPassword />,
  },
  {
    path: ':uid/:token',
    element: <ResetPassword />,
  },
  {
    path: 'accounts/signup-agree',
    element: <TermsAgreement />,
  },
  {
    path: 'accounts/signup',
    element: <Signup />,
  },
  {
    element: <PrivateRouter />,
    children: [
      {
        element: <Layout />,
        children: [
          ...routes,
          { path: '', element: <Navigate to="/home" replace /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/confirm',
    element: <Confirm />,
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

reportWebVitals();
