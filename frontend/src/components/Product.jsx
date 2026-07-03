import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="premium-card">
      <div className="premium-card-img-container">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="premium-card-body">
        <div className="premium-product-title">{product.name}</div>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <div className="premium-product-price">${product.price}</div>
      </div>
    </Link>
  );
};

export default Product;
