import { lazy, Suspense } from 'react'
import './App.css';

import Layout from './components/layout/Layout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';
import Loadable from './components/layout/Loadable';
import Loader from './components/layout/Loadable';
import PageLayout from './components/layout/PageLayout';
import Missing from './pages/error/Missing';
import Unauthorized from './pages/error/Unauthorized';
import SignPage from './pages/SignPage';
import Home from './pages/Home';
import FiltersPage from './pages/FiltersPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

const ResetPage = Loadable(lazy(() => import('./pages/ResetPage')));
const Checkout = Loadable(lazy(() => import('./pages/Checkout')));
const Profile = Loadable(lazy(() => import('./pages/Profile')));

const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const ManageBooks = Loadable(lazy(() => import('./pages/dashboard/ManageBooks')));
const ManageAccounts = Loadable(lazy(() => import('./pages/dashboard/ManageAccounts')));
const ManageReceipts = Loadable(lazy(() => import('./pages/dashboard/ManageReceipts')));
const ManageReviews = Loadable(lazy(() => import('./pages/dashboard/ManageReviews')));
const DetailProduct = Loadable(lazy(() => import('./pages/dashboard/DetailProduct.jsx')));
const DetailAccount = Loadable(lazy(() => import('./pages/dashboard/DetailAccount.jsx')));
const Dashboard = Loadable(lazy(() => import('./pages/dashboard/Dashboard')));

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          //PUBLIC
          <Route path="/login" element={<SignPage />} />
          <Route path="/signup" element={<SignPage />} />
          <Route path="/reset-password" element={<ResetPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          //MISSING
          <Route path="*" element={<Missing />} />

          <Route element={<PersistLogin />}>
            <Route element={<PageLayout />}>
              //ANONYMOUS
              <Route path="/" element={<Home />} />
              <Route path="/filters" element={<FiltersPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />

              //USER
              <Route element={<RequireAuth allowedRoles={['ROLE_USER']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile/:tab" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<DashboardLayout />}>
              //SELLER
              <Route element={<RequireAuth allowedRoles={['ROLE_SELLER']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manage-books" element={<ManageBooks />} />
                <Route path="/manage-receipts" element={<ManageReceipts />} />
                <Route path="/detail/:id" element={<DetailProduct />} />
              </Route>

              //ADMIN
              <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/manage-accounts" element={<ManageAccounts />} />
                <Route path="/manage-reviews" element={<ManageReviews />} />
                <Route path="/user/:id" element={<DetailAccount />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
