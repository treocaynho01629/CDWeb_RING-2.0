import './App.css';
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Loader } from './components/layout/Loadable';
import useReachable from './hooks/useReachable';
import Loadable from './components/layout/Loadable';
import Layout from './components/layout/Layout';
import PageLayout from './components/layout/PageLayout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';
import ScrollToTop from './components/layout/ScrollToTop.jsx';

const Missing = Loadable(lazy(() => import('./pages/error/Missing')));
const Unauthorized = Loadable(lazy(() => import('./pages/error/Unauthorized')));
const FiltersPage = Loadable(lazy(() => import('./pages/FiltersPage')));
const ProductDetail = Loadable(lazy(() => import('./pages/ProductDetail')));
const Cart = Loadable(lazy(() => import('./pages/Cart')));
const Home = Loadable(lazy(() => import('./pages/Home')));
const AuthPage = Loadable(lazy(() => import('./pages/AuthPage.jsx')));

const ProfileLayout = Loadable(lazy(() => import('./components/layout/ProfileLayout')));
const ResetPage = Loadable(lazy(() => import('./pages/ResetPage')));
const Checkout = Loadable(lazy(() => import('./pages/Checkout')));
const Profile = Loadable(lazy(() => import('./pages/Profile')));
const Orders = Loadable(lazy(() => import('./pages/Orders')));

const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const ManageProducts = Loadable(lazy(() => import('./pages/dashboard/ManageProducts')));
const ManageUsers = Loadable(lazy(() => import('./pages/dashboard/ManageUsers')));
const ManageOrders = Loadable(lazy(() => import('./pages/dashboard/ManageOrders')));
const ManageReviews = Loadable(lazy(() => import('./pages/dashboard/ManageReviews')));
const DetailProduct = Loadable(lazy(() => import('./pages/dashboard/DetailProduct.jsx')));
const DetailAccount = Loadable(lazy(() => import('./pages/dashboard/DetailAccount.jsx')));
const Dashboard = Loadable(lazy(() => import('./pages/dashboard/Dashboard')));

function App() {
  useReachable(); //Test connection to server

  return (
    <Suspense fallback={<Loader />}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
            //PUBLIC
          <Route path="/reset/:token?" element={<ResetPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

            //MISSING
          <Route path="*" element={<Missing />} />

          <Route element={<PersistLogin />}>
            <Route path="/auth/:tab" element={<AuthPage />} />

            <Route element={<PageLayout />}>
                //ANONYMOUS
              <Route path="/" element={<Home />} />
              <Route path="/store/:cSlug?" element={<FiltersPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/product-id/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />

                //USER
              <Route element={<RequireAuth allowedRoles={['ROLE_USER']} />}>
                <Route path="/checkout" element={<Checkout />} />

                <Route element={<ProfileLayout />}>
                  <Route path="/profile/detail/:tab?" element={<Profile />} />
                  <Route path="/profile/order" element={<Orders />} />
                  <Route path="/profile/review" element={<Orders />} />
                </Route>
              </Route>
            </Route>

            <Route element={<DashboardLayout />}>
                //SELLER
              <Route element={<RequireAuth allowedRoles={['ROLE_SELLER']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manage-products" element={<ManageProducts />} />
                <Route path="/manage-orders" element={<ManageOrders />} />
                <Route path="/detail/:id" element={<DetailProduct />} />
                <Route path="/user/:id" element={<DetailAccount />} />
              </Route>

                //ADMIN
              <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-reviews" element={<ManageReviews />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
