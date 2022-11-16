import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from './../Store';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../component/CheckoutSteps';
export default function ShippingAddressScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
    userInfo,
  } = state;

  const [fullname, setFullName] = useState(shippingAddress.fullname || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullname, address, city, postalCode, country },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ fullname, address, city, postalCode, country })
    );

    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="fullname">fullname</label>
            <input
              type="text"
              className="form-control"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="fullname"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="city"
            />
          </div>
          <div className="form-group">
            <label htmlFor="postalcode">postalCode</label>
            <input
              type="text"
              className="form-control"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="postalcode"
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="country"
            />
          </div>
          <button type="submit" className="btn btn-primary my-3">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
