import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

import Product from './../component/products';
import { Helmet } from 'react-helmet-async';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function HomeScreen() {
  const [{ products, error, loading }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="row">
          <Helmet>
            <title>Amazona</title>
          </Helmet>
          {products.map((product) => (
            <div key={product.slug} className="col-md-4 col-sm-8 col-lg-3">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  //   <div>
  //   <h1>feature products</h1>
  //   <div className="products">
  //     {loading ? (
  //       <div>...loading</div>
  //     ) : error ? (
  //       <div>{error}</div>
  //     ) : (
  //       <Row>
  //         {products.map((product) => (
  //           <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
  //             <Product product={product} />
  //           </Col>
  //         ))}
  //       </Row>
  //     )}
  //   </div>
  // </div>
  // );
}
