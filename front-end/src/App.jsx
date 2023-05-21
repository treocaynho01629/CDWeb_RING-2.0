import { lazy, Suspense } from 'react'
import './App.css';

import { styled as muiStyled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import Layout from './components/authorize/Layout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';

import Home from './pages/Home';
import FiltersPage from './pages/FiltersPage';
import ProductDetail from './pages/ProductDetail';

const Cart = lazy(() => import('./pages/Cart')) ;
const SignPage = lazy(() => import('./pages/SignPage')) ;
const Unauthorized = lazy(() => import('./pages/error/Unauthorized')) ;

const Missing = lazy(() => import('./pages/error/Missing')) ;
const Checkout = lazy(() => import('./pages/Checkout')) ;
const Profile = lazy(() => import('./pages/Profile')) ;

import ManageBooks from './pages/dashboard/ManageBooks';
import ManageAccounts from './pages/dashboard/ManageAccounts';
import DetailProduct from './pages/dashboard/DetailProduct';

const Admin = lazy(() => import('./pages/dashboard/Admin')) ;
const Management = lazy(() => import('./pages/dashboard/Management')) ;

import {
  Routes,
  Route
} from 'react-router-dom';

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'white',
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

            //SELLER
            <Route element={<RequireAuth allowedRoles={['ROLE_SELLER']} />}>
              <Route path="/management" element={<Management/>}/>
              <Route path="/manage-books" element={<ManageBooks/>}/>
              <Route path="/detail/:id" element={<DetailProduct/>}/>
            </Route>

            //ADMIN
            <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin" element={<Admin/>}/>
              <Route path="/manage-accounts" element={<ManageAccounts/>}/>
              {/* <Route path="/manage-receipts" element={<ManageAccounts/>}/> */}
              {/* <Route path="/manage-reviews" element={<ManageAccounts/>}/> */}
            </Route>
          </Route>
        </Route>
    </Routes>
    </Suspense>
  )
}

export default App
