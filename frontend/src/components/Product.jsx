import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="premium-card">
      <div className="premium-card-img-container">
        <img src={product.image} alt={product.name} />
        {product.brand && (
          <span className="premium-card-brand">{product.brand}</span>
        )}
      </div>
      <div className="premium-card-body">
        <div className="premium-product-title">{product.name}</div>
        <div className="mb-2">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>
        <div className="premium-product-footer">
          <div className="premium-product-price">${product.price}</div>
          <div className="premium-product-action-btn">
            <span className="arrow-icon">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
