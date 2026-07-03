import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row className="auth-split-container my-5">
      <Col md={6} className="auth-branding-side login-bg d-none d-md-flex">
        <h1 className="auth-branding-title">Welcome Back to eMart.</h1>
        <p className="auth-branding-subtitle">
          Sign in to access your premium account, track orders, and discover new arrivals.
        </p>
      </Col>
      <Col md={6} className="auth-form-side">
        <h2 className="auth-header">Sign In</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="email">
            <Form.Label className="auth-label">Email Address</Form.Label>
            <Form.Control
              className="premium-auth-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label className="auth-label">Password</Form.Label>
            <Form.Control
              className="premium-auth-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <button disabled={isLoading} type="submit" className="auth-btn">
            Sign In
          </button>

          {isLoading && <Loader />}
        </Form>

        <div className="mt-5 text-center">
          <span className="text-muted">New Customer? </span>
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="fw-bold text-dark text-decoration-none">
            Create an account
          </Link>
        </div>
      </Col>
    </Row>
  );
};

export default LoginScreen;
