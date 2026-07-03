import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
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
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-header">Create Account.</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="name">
            <Form.Label className="auth-label">Name</Form.Label>
            <Form.Control
              className="auth-input"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Label className="auth-label">Email Address</Form.Label>
            <Form.Control
              className="auth-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label className="auth-label">Password</Form.Label>
            <Form.Control
              className="auth-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label className="auth-label">Confirm Password</Form.Label>
            <Form.Control
              className="auth-input"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button disabled={isLoading} type="submit" variant="primary" className="auth-btn">
            Register
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-4 text-center mt-3">
          <Col>
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="fw-bold">
              Sign In
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RegisterScreen;
