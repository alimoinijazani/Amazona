import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './rating';
export default function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:5000/api/products/product/${product._id}`
    );

    if (data.countInStock < quantity) {
      window.alert('sorry product out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };
  return (
    <div key={product.slug} className="card">
      <Link to={`/products/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top"
        ></img>
      </Link>
      <div className="card-body">
        <Link to={`/products/${product.slug}`}>
          <div className="card-title">{product.name}</div>
        </Link>
        <Rating rating={product.rating} />
        <div className="card-text">${product.price}</div>
        <div>
          {product.countInStock === 0 ? (
            <button className="btn btn-light">out of stock</button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => addToCartHandler(product)}
            >
              add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
