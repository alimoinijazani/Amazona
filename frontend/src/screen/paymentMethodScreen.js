import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../component/CheckoutSteps';
import { Store } from './../Store';
import { useNavigate } from 'react-router-dom';
export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || ''
  );
  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault(e);
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="form-check">
            <label className="form-check-label" htmlFor="paypal">
              PayPal
            </label>
            <input
              className="form-check-input"
              type="radio"
              id="paypal"
              value="paypal"
              checked={paymentMethodName === 'paypal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="form-check">
            <label className="form-check-label" htmlFor="stripe">
              Stripe
            </label>
            <input
              className="form-check-input"
              type="radio"
              id="stripe"
              value="stripe"
              checked={paymentMethodName === 'stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <button className="btn btn-primary my-3" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
