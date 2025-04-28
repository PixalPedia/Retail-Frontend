import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCart from './AddToCart'; // Import AddToCart component
import '../styles/ProductCard.css';
import '../styles/Responsive/ProductCard.responsive.css';
import { wrapperFetch } from '../../utils/wrapperfetch';

const ProductCard = ({ product, userId }) => {
  const navigate = useNavigate();
  const [showAddToCart, setShowAddToCart] = useState(false); // Manage modal visibility

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
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
          <button
            className="cart-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              setShowAddToCart(true); // Show AddToCart modal
            }}
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>

      {showAddToCart && (
        <AddToCart
          productId={product.id}
          userId={userId}
          onClose={() => setShowAddToCart(false)} // Close modal
        />
      )}
    </>
  );
};

export default ProductCard;
