import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row className="auth-split-container my-5">
      <Col md={6} className="auth-branding-side d-none d-md-flex">
        <h1 className="auth-branding-title">Join eMart Today.</h1>
        <p className="auth-branding-subtitle">
          Create an account to track your orders, save your favorite products, and access exclusive premium deals.
        </p>
      </Col>
      <Col md={6} className="auth-form-side">
        <h2 className="auth-header">Create Account</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="name">
            <Form.Label className="auth-label">Name</Form.Label>
            <Form.Control
              className="premium-auth-input"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

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

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label className="auth-label">Confirm Password</Form.Label>
            <Form.Control
              className="premium-auth-input"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <button disabled={isLoading} type="submit" className="auth-btn">
            Register
          </button>

          {isLoading && <Loader />}
        </Form>

        <div className="mt-5 text-center">
          <span className="text-muted">Already have an account? </span>
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="fw-bold text-dark text-decoration-none">
            Sign In
          </Link>
        </div>
      </Col>
    </Row>
  );
};

export default RegisterScreen;
