import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
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
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-header">Welcome Back.</h1>

        <Form onSubmit={submitHandler}>
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

          <Button disabled={isLoading} type="submit" variant="primary" className="auth-btn">
            Sign In
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-4 text-center mt-3">
          <Col>
            New Customer?{" "}
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="fw-bold">
              Create an account
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginScreen;
