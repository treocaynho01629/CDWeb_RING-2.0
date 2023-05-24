import { lazy, Suspense } from 'react'
import './App.css';

import { styled as muiStyled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import Layout from './components/authorize/Layout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';

const PageLayout = lazy(() => import('./components/PageLayout'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));

const Home = lazy(() => import('./pages/Home'));
const FiltersPage = lazy(() => import('./pages/FiltersPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

const Cart = lazy(() => import('./pages/Cart')) ;
const SignPage = lazy(() => import('./pages/SignPage')) ;
const Unauthorized = lazy(() => import('./pages/error/Unauthorized')) ;

const Missing = lazy(() => import('./pages/error/Missing')) ;
const Checkout = lazy(() => import('./pages/Checkout')) ;
const Profile = lazy(() => import('./pages/Profile')) ;

const ManageBooks = lazy(() => import('./pages/dashboard/ManageBooks')) ;
const ManageAccounts = lazy(() => import('./pages/dashboard/ManageAccounts')) ;
const ManageReceipts = lazy(() => import('./pages/dashboard/ManageReceipts')) ;
const ManageReviews = lazy(() => import('./pages/dashboard/ManageReviews')) ;
const DetailProduct = lazy(() => import('./pages/dashboard/DetailProduct.jsx')) ;
const DetailAccount = lazy(() => import('./pages/dashboard/DetailAccount.jsx')) ;

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard')) ;

import { Routes, Route } from 'react-router-dom';

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'gray',
  },
  [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 0,
      backgroundColor: '#63e399',
  },
}));

function App() {
  return (
    <Suspense fallback={<CustomLinearProgress/>}>
    <Routes>
        <Route path="/" element={<Layout />}>
          //PUBLIC
          <Route path="/login" element={<SignPage/>}/>
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
