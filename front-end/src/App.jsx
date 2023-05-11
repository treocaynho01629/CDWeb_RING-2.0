import './App.css';
import Cart from './pages/Cart';
import FiltersPage from './pages/FiltersPage';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import SignPage from './pages/SignPage';
import Unauthorized from './pages/Unauthorized';
import Missing from './pages/Missing';
import Admin from './pages/Admin';

import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistsLogin';

import {
  Routes,
  Route
} from 'react-router-dom';

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
          </Route>

          //ADMIN
          <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin" element={<Admin/>}/>
          </Route>
        </Route>

        //MISSING
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
