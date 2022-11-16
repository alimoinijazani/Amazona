import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from './../Store';

import { toast } from 'react-toastify';
import { getError } from '../util';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('password do not match');
      return;
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/signup',
        {
          name,
          email,
          password,
        }
      );
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
        <title>Sing Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group mb-3">
          <label htmlFor="user">Name</label>
          <input
            id="name"
            className="form-control"
            type="name"
            required
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="user">Email</label>
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
        <div className="form-group mb-3">
          <label htmlFor="password">confirm Password</label>
          <input
            className="form-control"
            id="confirmPassword"
            type="password"
            required
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Sign up
          </button>
        </div>
        <div>
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign_In</Link>
        </div>
      </form>
    </div>
  );
}
