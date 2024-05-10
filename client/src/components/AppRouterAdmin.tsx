import DashboardAdmin from '../pages/admin/dashboardAdmin';
import TypesAdmin from '../pages/admin/typesAdmin';
import BarndsAdmin from '../pages/admin/brandsAdmin';
import OrdersAdmin from '../pages/admin/ordersAdmin';
import ProductsAdmin from '../pages/admin/productsAdmin';
import BillsAdmin from '../pages/admin/billsAdmin';
import UsersAdmin from '../pages/admin/usersAdmin';
import SettingsPage from '../pages/admin/settings';
export const AdminRoutes = [
    {
        path: '/admin/',
        index: true,
        element: <DashboardAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/orders/',
        element: <OrdersAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/types',
        element: <TypesAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/brands',
        element: <BarndsAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/products',
        element: <ProductsAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/bills',
        element: <BillsAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/users',
        element: <UsersAdmin />,
        private: ['ADMIN'],
    },
    {
        path: '/admin/settings',
        element: <SettingsPage />,
        private: ['ADMIN'],
    },
];
