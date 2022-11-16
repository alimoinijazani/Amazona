import React, { useContext, useEffect, useReducer } from 'react';
import Loading from './../component/loading';
import MessageBox from './../component/MessageBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from './../util';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
};
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, order, error, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `http://localhost:5000/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order Is Paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get(
          'http://localhost:5000/api/keys/paypal',
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'USD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPayPalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);
  return loading ? (
    <Loading />
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Shipping</h5>
              <div className="card-text">
                <strong>Name:</strong>
                {order.shippingAddress.fullname}
                <br />
                <strong>Address:</strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
                <br />
              </div>
              {order.isDelivered ? (
                <MessageBox>Delivered At {order.deliveredAt}</MessageBox>
              ) : (
                <MessageBox>Not Deliverd</MessageBox>
              )}
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Payment</h5>
              <div className="card-text">
                <strong>Payment:</strong>
                {order.paymentMethod}
                <br />
                {order.isPaid ? (
                  <MessageBox>Paid At {order.paidAt}</MessageBox>
                ) : (
                  <MessageBox>Not Paid</MessageBox>
                )}
              </div>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Items</h5>
              <ul className="list-group-flushed">
                {order.orderItems.map((item) => (
                  <li key={item._id} className="list-group-item">
                    <div className="row align-item-center">
                      <div className="col-md-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid img-thumbnail"
                        />
                        <Link to={`products/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className="col-md-3">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="col-md-3">${item.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <ul className="list-group-flush">
                <li className="list-group-item">
                  <div className="row">
                    <div className="col">Shipping</div>
                    <div className="col">${order.shippingPrice}</div>
                  </div>
                </li>

                <li className="list-group-item">
                  <div className="row">
                    <div className="col">Tax Price</div>
                    <div className="col">${order.taxPrice}</div>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="row">
                    <div className="col">
                      <strong>order Total</strong>
                    </div>
                    <div className="col">
                      <strong>${order.totalPrice}</strong>
                    </div>
                  </div>
                </li>
                {!order.isPaid && (
                  <li className="list-group-item">
                    {isPending ? (
                      <Loading />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <Loading />}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
