import './App.css';
import Cart from './pages/Cart';
import FiltersPage from './pages/FiltersPage';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import SignPage from './pages/SignPage';
import Unauthorized from './pages/error/Unauthorized';
import Missing from './pages/error/Missing';
import Admin from './pages/dashboard/Admin';
import Management from './pages/dashboard/Management';
import ManageBooks from './pages/dashboard/ManageBooks';

import Layout from './components/authorize/Layout';
import RequireAuth from './components/authorize/RequireAuth';
import PersistLogin from './components/authorize/PersistsLogin';

import {
  Routes,
  Route
} from 'react-router-dom';
import ManageAccounts from './pages/dashboard/ManageAccounts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        //PUBLIC
        <Route path="/login" element={<SignPage/>}/>
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          //ANONYMOUS
          <Route path="/" element={<Home/>}/>
          <Route path="/filters" element={<FiltersPage/>}/>
          <Route path="/product/:id" element={<ProductDetail/>}/>
          <Route path="/cart" element={<Cart/>}/>

          //USER
          <Route element={<RequireAuth allowedRoles={['ROLE_USER']} />}>
            <Route path="/checkout" element={<Checkout/>}/>
          </Route>

          //SELLER
          <Route element={<RequireAuth allowedRoles={['ROLE_SELLER']} />}>
            <Route path="/management" element={<Management/>}/>
            <Route path="/manage-books" element={<ManageBooks/>}/>
          </Route>

          //ADMIN
          <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/manage-accounts" element={<ManageAccounts/>}/>
          </Route>
        </Route>

        //MISSING
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
