import axios from 'axios';
import React, { useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '../component/rating';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from '../component/loading';
import MessageBox from '../component/MessageBox';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'fetch_data': {
      return { ...state, loading: true };
    }
    case 'fetch_success': {
      return { ...state, loading: false, product: action.payload };
    }
    case 'fetch_error': {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
};

export default function ProductScreen() {
  const navigate = useNavigate();
  const [{ product, error, loading }, dispatch] = useReducer(reducer, {
    error: '',
    product: [],
    loading: true,
  });
  const params = useParams();
  const { slug } = params;
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'fetch_data' });
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${slug}`
        );
        dispatch({ type: 'fetch_success', payload: data });
      } catch (err) {
        dispatch({ type: 'fetch_error', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
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
    navigate('/cart');
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <MessageBox error={error} />
  ) : (
    <div>
      <Helmet>
        <title>{slug}</title>
      </Helmet>
      <Row>
        <Col md={6}>
          <img
            className="image-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ul className="list-group-flush">
            <h1 className="list-group-item">{product.name}</h1>
            <li className="list-group-item">
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </li>
            <li className="list-group-item">price: ${product.price}</li>
            <li className="list-group-item">
              Description: ${product.description}
            </li>
          </ul>
        </Col>
        <Col md={3}>
          <div className="card">
            <div className="card-body">
              <ul className="list-group-flush">
                <li className="list-group-item">
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </li>
                <li className="list-group-item">
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <span className="badge bg-success">In Stock</span>
                      ) : (
                        <span className="badge bg-danger">Unavailable</span>
                      )}
                    </Col>
                  </Row>
                </li>
                {product.countInStock > 0 && (
                  <li className="list-group-item">
                    <div className="d-grid">
                      <button
                        className="btn btn-primary"
                        onClick={addToCartHandler}
                      >
                        add to card
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
