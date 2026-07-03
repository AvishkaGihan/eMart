import { useNavigate } from "react-router-dom";
import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <Navbar variant="light" expand="md" collapseOnSelect className="border-bottom shadow-none" sticky="top" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fs-3 text-gradient">
              <span style={{ fontStyle: 'italic', fontWeight: 900, marginRight: '1px' }}>e</span>
              <span className="fw-bold">Mart</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto" style={{ flex: 1, maxWidth: '600px', justifyContent: 'center' }}>
              <SearchBox />
            </Nav>
            <Nav className="ms-auto align-items-center">
              <LinkContainer to="/cart">
                <Nav.Link className="d-flex align-items-center me-3">
                  <FaShoppingCart className="me-2" /> Cart
                  {cartItems.length > 0 && (
                    <Badge
                      pill
                      style={{
                        marginLeft: "5px",
                        background: "var(--gradient-primary)",
                        color: "#fff"
                      }}
                    >
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="nav-sign-in-btn d-flex align-items-center text-nowrap">
                    <FaUser className="me-2" /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
