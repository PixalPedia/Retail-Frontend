import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../components/styles/ProductCard.css';
import '../../../components/styles/Responsive/ProductCard.responsive.css';
import { wrapperFetch } from '../../../utils/wrapperfetch';

const PreviewProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/preview-product/${product.id}`);
  };

  const handleEditProduct = () => {
    navigate(`/product-edit/${product.id}`);
  };

  const discountedPrice =
    product.is_discounted && product.discount_amount
      ? (product.price - product.discount_amount).toFixed(2)
      : product.price.toFixed(2);

  return (
    <>
      <div className="product-card" onClick={handleCardClick}>
        <div className="product-image-container">
          {product.is_discounted && product.discount_amount && (
            <span className="discount-badge">Save ₹{product.discount_amount}</span>
          )}
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.title || 'Product Image'}
            className="product-image"
          />
        </div>

        <h3 className="product-title">{product.title || 'Unnamed Product'}</h3>
        <hr className="divider" />
        <div className="product-info">
          {product.is_discounted && product.discount_amount ? (
            <p className="product-price">
              <span className="original-price">₹{product.price.toFixed(2)}</span> ₹{discountedPrice}
            </p>
          ) : (
            <p className="product-price">₹{product.price.toFixed(2)}</p>
          )}
          <p className="product-id">ID: {product.id}</p> {/* Show product ID */}
          <button
            className="edit-button-preview-card"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleEditProduct(); // Navigate to edit page
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

export default PreviewProductCard;
