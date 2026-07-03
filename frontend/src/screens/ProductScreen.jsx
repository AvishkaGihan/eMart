import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import Meta from "../components/Meta";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productApiSlice";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-outline-dark my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row className="mb-5">
            <Col md={6}>
              <div className="product-hero-img-container">
                <img src={product.image} alt={product.name} className="product-hero-img" />
              </div>
            </Col>
            
            <Col md={6}>
              <div className="product-editorial-details">
                <h1 className="product-editorial-title">{product.name}</h1>
                <div className="mb-3">
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </div>
                <div className="product-editorial-price">${product.price}</div>
                <p className="product-editorial-desc">{product.description}</p>
                
                <div className="mb-4">
                  <strong>Availability: </strong>
                  {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                </div>

                {product.countInStock > 0 && (
                  <div className="mb-4 d-flex align-items-center">
                    <strong className="me-3">Quantity:</strong>
                    <Form.Select
                      className="premium-qty-select"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                )}

                <button
                  className="premium-add-to-cart"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  {product.countInStock > 0 ? "Add To Cart" : "Out of Stock"}
                </button>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col md={8} className="mx-auto">
              <h2 className="mb-4" style={{fontWeight: 800}}>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              
              <div className="mb-5">
                {product.reviews.map((review) => (
                  <div key={review._id} className="review-list-item">
                    <h5 style={{fontWeight: 700}}>{review.name}</h5>
                    <Rating value={review.rating} />
                    <p className="text-muted small mb-2">{review.createdAt.substring(0, 10)}</p>
                    <p className="mb-0">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-4" style={{fontWeight: 700}}>Write a Customer Review</h3>

                {loadingProductReview && <Loader />}

                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-4" controlId="rating">
                      <Form.Label className="fw-bold">Rating</Form.Label>
                      <Form.Select
                        required
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '12px' }}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4" controlId="comment">
                      <Form.Label className="fw-bold">Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ padding: '1rem', borderRadius: '12px' }}
                      ></Form.Control>
                    </Form.Group>
                    
                    <Button
                      disabled={loadingProductReview}
                      type="submit"
                      variant="dark"
                      className="px-5 py-3 rounded-pill fw-bold"
                    >
                      Submit Review
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to="/login">sign in</Link> to write a review
                  </Message>
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
