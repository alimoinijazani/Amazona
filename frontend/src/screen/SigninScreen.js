import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from './../Store';

import { toast } from 'react-toastify';
import { getError } from '../util';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="container small-container">
      <Helmet>
        <title>Sing in</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group mb-3">
          <label htmlFor="user">UserName</label>
          <input
            id="username"
            className="form-control"
            type="email"
            required
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            id="password"
            type="password"
            required
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Signin
          </button>
        </div>
        <div>
          New Customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Creat your account</Link>
        </div>
      </form>
    </div>
  );
}
