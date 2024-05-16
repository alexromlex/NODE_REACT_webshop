import { useLocation, useRoutes } from 'react-router-dom';
import PageNotFound from '../pages/404';
import ProductPage from '../pages/product';
import AuthPage from '../pages/auth';
import LayOut from './LayOut';
import userStore from '../stores/userStore';
import BasketPage from '../pages/basket';
import { AdminRoutes } from './AppRouterAdmin';
import AdminLayout from './LayOutAdmin';
import ShopPage from '../pages/shop';
import OrdersPage from '../pages/orders';
import UserPage from '../pages/user';
import CheckoutPage from '../pages/checkout';
import CheckoutSuccess from '../pages/checkoutSuccess';
import TermsConditionsPage from '../pages/general_terms';
import PrivacyPolicyPage from '../pages/privacy_policy';
import PageError from '../pages/403';

export interface RouteInterface {
  path: string;
  element: React.ReactElement;
  private: null | string;
  children?: RouteInterface[];
  errorElement?: React.FC;
}
const AppRouter = () => {
  // console.log('[AppRouter] called!');
  const location = useLocation();
  const AllRoutes = [
    {
      path: '/',
      // element: <ShopPage />,
      element: <LayOut />,
      errorElement: <PageNotFound />,
      private: null,
      children: [
        {
          path: '/',
          element: <ShopPage />,
          private: null,
        },
        {
          path: '/product/:id',
          element: <ProductPage />,
          private: null,
        },
        {
          path: '/user',
          element: <UserPage />,
          private: ['USER'],
        },
        {
          path: '/orders',
          element: <OrdersPage />,
          private: ['USER'],
        },
        {
          path: '/basket',
          element: <BasketPage />,
          private: null,
        },
        {
          path: '/checkout',
          element: <CheckoutPage />,
          private: ['USER'],
        },
        {
          path: '/checkout_success',
          element: <CheckoutSuccess />,
          private: ['USER'],
        },

        {
          path: '/login',
          element: <AuthPage />,
          private: null,
        },
        {
          path: '/register',
          element: <AuthPage />,
          private: null,
        },
        {
          path: '/admin',
          element: <AdminLayout />,
          private: ['ADMIN'],
          children: AdminRoutes,
        },
        {
          path: '/genterms',
          element: <TermsConditionsPage />,
          private: null,
        },
        {
          path: '/privacypolicy',
          element: <PrivacyPolicyPage />,
          private: null,
        },
      ],
    },
    {
      path: '/page_not_found',
      element: <PageNotFound />,
      private: null,
    },
    {
      path: '/error',
      element: <PageError />,
      private: null,
    },
    { path: '*', element: <PageNotFound />, private: null },
  ];

  function filterRoutes(routes) {
    const filteredAllRouts = [];

    for (const route of routes) {
      if (route.children) {
        route.children = filterRoutes(route.children);
      }
      if (!route.private) {
        filteredAllRouts.push(route);
        continue;
      }
      if (!userStore.isAuth) {
        // console.log('not logged...');
        if ('USER'.includes(route.private)) {
          route.element = <AuthPage returnUrl={location.pathname} />;
          filteredAllRouts.push(route);
          continue;
        }
      }
      // IF ROLE ADMIN
      if (userStore.user?.role === 'ADMIN') {
        filteredAllRouts.push(route);
        continue;
      }
      if (!userStore.user?.role.includes(route.private)) {
        continue;
      }
      filteredAllRouts.push(route);
    }

    return filteredAllRouts;
  }

  return useRoutes(filterRoutes(AllRoutes));
};

export default AppRouter;
