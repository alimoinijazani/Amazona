import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screen/HomeScreen';
import NavScreen from './screen/NavScreen';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ProductScreen from './screen/ProductScreen';
import CartScreen from './screen/CartScreen';
import SigninScreen from './screen/SigninScreen';
import ShippingAddressScreen from './screen/ShippingAddressScreen';
import SignupScreen from './screen/SignupScreen';
import PaymentMethodScreen from './screen/paymentMethodScreen';
import PlaceOrderScreen from './screen/placeOrderScreen';
import OrderScreen from './screen/OrderScreen';
import OrderHistoryScreen from './screen/OrderHistoryScreen';
import ProfileScreen from './screen/ProfileScreen';
export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <NavScreen />
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/products/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
          </div>
        </main>
        <footer>
          <div className="text-center">All Right Reserve</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
