import { lazy, Suspense } from 'react'
import './App.css';

import Layout from './components/authorize/Layout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';
import Loadable from './components/authorize/Loadable';
import Loader from './components/authorize/Loadable';

const PageLayout = lazy(() => import('./components/PageLayout'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));

const Home = Loadable(lazy(() => import('./pages/Home')));
const FiltersPage = Loadable(lazy(() => import('./pages/FiltersPage')));
const ProductDetail = Loadable(lazy(() => import('./pages/ProductDetail')));

const Cart = Loadable(lazy(() => import('./pages/Cart')));
const SignPage = Loadable(lazy(() => import('./pages/SignPage')));
const ResetPage = Loadable(lazy(() => import('./pages/ResetPage')));
const Unauthorized = Loadable(lazy(() => import('./pages/error/Unauthorized')));

const Missing = Loadable(lazy(() => import('./pages/error/Missing')));
const Checkout = Loadable(lazy(() => import('./pages/Checkout')));
const Profile = Loadable(lazy(() => import('./pages/Profile')));

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
    <Suspense fallback={<Loader/>}>
    <Routes>
        <Route path="/" element={<Layout />}>
          //PUBLIC
          <Route path="/login" element={<SignPage/>}/>
          <Route path="/reset-password" element={<ResetPage/>}/>
          <Route path="/unauthorized" element={<Unauthorized />} />

          //MISSING
          <Route path="*" element={<Missing />} />

          <Route element={<PersistLogin />}>
            <Route element={<PageLayout />}>
              //ANONYMOUS
              <Route path="/" element={<Home/>}/>
              <Route path="/filters" element={<FiltersPage/>}/>
              <Route path="/product/:id" element={<ProductDetail/>}/>
              <Route path="/cart" element={<Cart/>}/>

              //USER
              <Route element={<RequireAuth allowedRoles={['ROLE_USER']} />}>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/profile/:tab" element={<Profile/>}/>
              </Route>
            </Route>

            <Route element={<DashboardLayout />}>
              //SELLER
              <Route element={<RequireAuth allowedRoles={['ROLE_SELLER']} />}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/manage-books" element={<ManageBooks/>}/>
                <Route path="/manage-receipts" element={<ManageReceipts/>}/>
                <Route path="/detail/:id" element={<DetailProduct/>}/>
              </Route>

              //ADMIN
              <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/manage-accounts" element={<ManageAccounts/>}/>
                <Route path="/manage-reviews" element={<ManageReviews/>}/>
                <Route path="/user/:id" element={<DetailAccount/>}/>
              </Route>
            </Route>
          </Route>
        </Route>
    </Routes>
    </Suspense>
  )
}

export default App
