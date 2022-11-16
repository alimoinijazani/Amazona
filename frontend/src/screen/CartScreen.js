import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../component/MessageBox';
import { Store } from './../Store';
import { FaPlusCircle, FaMinusCircle, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      ` http://localhost:5000/api/products/product/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert('sorry.product is out of stock');
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeCartHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div className="row">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <div className="col-md-8">
        {cart.cartItems.length === 0 ? (
          <MessageBox>
            <Link to="/">go Shopping</Link>
          </MessageBox>
        ) : (
          <ul className="list-group">
            {cart.cartItems.map((product) => (
              <li key={product._id} className="list-group-item ">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <img
                      className="img-fluid rounded img-thumbnail"
                      src={product.image}
                      alt={product.name}
                    ></img>
                    <Link to={`/products/${product.slug}`}>{product.name}</Link>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-light"
                      disabled={product.quantity === 1}
                      onClick={() =>
                        updateCartHandler(product, product.quantity - 1)
                      }
                    >
                      <FaMinusCircle />
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      className="btn btn-light"
                      disabled={product.quantity === product.countInStock}
                      onClick={() =>
                        updateCartHandler(product, product.quantity + 1)
                      }
                    >
                      <FaPlusCircle />
                    </button>
                  </div>
                  <div className="col-md-3">${product.price}</div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-light"
                      onClick={() => removeCartHandler(product)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <ul className="list-group-flush">
              <li className="list-group-item">
                <h3>
                  subtotal ({cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  items): $
                  {cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </h3>
              </li>
              <li className="list-group-item">
                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    disabled={cart.cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
