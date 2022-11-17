import React, { useContext } from 'react';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';


import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
export default function NavScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <header>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="Brand">amazona</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto w-100 justify-content-end">
              {/* or ms-auto */}

              <li className="nav-item">
                <Link to="/cart" className="nav-link">
                  cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </li>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    to="#signout"
                    className="dropdown-item"
                    onClick={signoutHandler}
                  >
                    Sign out
                  </Link>
                </NavDropdown>
              ) : (
                <Link to="/signin" className="nav-link">
                  Sign In
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
