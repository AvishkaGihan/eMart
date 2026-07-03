import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row className="my-5">
      <Col md={8}>
        <h1 style={{ fontWeight: 800, marginBottom: "2rem" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <div className="mb-5">
            {cartItems.map((item) => (
              <Row key={item._id} className="cart-item-row mx-0">
                <Col md={2} className="px-0">
                  <div className="cart-img-container">
                    <img src={item.image} alt={item.name} />
                  </div>
                </Col>
                <Col md={4} className="d-flex align-items-center ps-4">
                  <Link to={`/product/${item._id}`} className="cart-item-title">
                    {item.name}
                  </Link>
                </Col>
                <Col md={2} className="d-flex align-items-center justify-content-center">
                  <div className="cart-item-price">${item.price}</div>
                </Col>
                <Col md={3} className="d-flex align-items-center justify-content-center">
                  <Form.Select
                    className="premium-qty-select w-100"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={1} className="d-flex align-items-center justify-content-end px-0">
                  <button
                    type="button"
                    className="cart-delete-btn"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash />
                  </button>
                </Col>
              </Row>
            ))}
          </div>
        )}
      </Col>
      
      <Col md={4}>
        <div className="premium-summary-box">
          <div className="premium-summary-title">
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
          </div>
          <div className="premium-summary-price">
            ${cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </div>
          
          <button
            type="button"
            className="premium-add-to-cart"
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed to Checkout
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default CartScreen;
