// SuperShare/ProductEditCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../SuperStyle/ProductEditCard.css';
import '../../components/styles/Responsive/ProductCard.responsive.css';
import { wrapperFetch } from '../../utils/wrapperfetch';

const ProductEditCard = ({ product, userId, onRightClick }) => {
  const navigate = useNavigate();

  // On left-click, navigate to product details (if needed)
  const handleCardClick = () => {
    navigate(`/preview-product/${product.id}`);
  };

  const discountedPrice =
    product.is_discounted && product.discount_amount
      ? (product.price - product.discount_amount).toFixed(2)
      : product.price.toFixed(2);

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      onContextMenu={onRightClick}
    >
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
            <span className="original-price">₹{product.price.toFixed(2)}</span>{' '}
            ₹{discountedPrice}
          </p>
        ) : (
          <p className="product-price">₹{product.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default ProductEditCard;
