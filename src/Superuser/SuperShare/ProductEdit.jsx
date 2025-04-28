// ProductEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuperHeader from '../SuperShare/SuperHeader';
import SuperMenu from '../SuperShare/SuperMenu';
import { useNotification } from '../../components/shared/NotificationContext';
import SuperCategorySection from './ProductEdit/SuperCategorySection';
import SuperTypeAndOption from './ProductEdit/SuperTypeAndOption';
import SuperCombo from './ProductEdit/SuperCombo';
import ImageCropperModal from '../SuperShare/ImageCropperModal';
import '../SuperStyle/ProductEdit.css';
import { wrapperFetch } from '../../utils/wrapperfetch';

const ProductEdit = ({ BASE_URL }) => {
  const { productId } = useParams();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const userId = localStorage.getItem('superuserId');

  // Header & Menu
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Basic Details State & Edit Mode
  const [product, setProduct] = useState(null);
  const [basicEditMode, setBasicEditMode] = useState(false);
  const [basicDetails, setBasicDetails] = useState({
    title: '',
    description: '',
    price: '',
    is_discounted: false,
    discount_amount: '',
    stock_quantity: '',
  });

  // Images State – Maintain both existing images (as URLs) and new File objects
  const [uploadedImages, setUploadedImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesEditMode, setImagesEditMode] = useState(false);

  // Crop modal state
  const [cropModalInfo, setCropModalInfo] = useState({
    visible: false,
    imageIndex: null,
    imageUrl: '',
  });

  // Image Context Menu state & ref
  const [imageContextMenu, setImageContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    imageIndex: null,
  });
  const imageContextRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (imageContextRef.current && !imageContextRef.current.contains(e.target)) {
        setImageContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch initial product details
  useEffect(() => {
   wrapperFetch(`${BASE_URL}/api/products/fetch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setBasicDetails({
            title: data.product.title,
            description: data.product.description,
            price: data.product.price,
            is_discounted: data.product.is_discounted,
            discount_amount: data.product.discount_amount,
            stock_quantity: data.product.stock_quantity,
          });
          if (data.product.images) {
            // Set both previews and uploadedImages (as URLs)
            setImagePreviews(data.product.images);
            setUploadedImages(data.product.images);
          }
        } else {
          showNotification('Failed to fetch product details', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showNotification('Error fetching product details', 'error');
      });
  }, [BASE_URL, productId, showNotification]);

  // --- Basic Details Handlers ---
  const handleBasicSave = () => {
    const updateData = {
      user_id: userId,
      product_id: productId,
      title: basicDetails.title,
      description: basicDetails.description,
      price: parseFloat(basicDetails.price),
      is_discounted: basicDetails.is_discounted,
      discount_amount: basicDetails.is_discounted ? parseFloat(basicDetails.discount_amount) : 0,
      stock_quantity: parseInt(basicDetails.stock_quantity, 10),
    };

   wrapperFetch(`${BASE_URL}/api/products/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          showNotification(data.message, 'success');
          setBasicEditMode(false);
        } else {
          throw new Error('Failed to update basic details');
        }
      })
      .catch((err) => {
        console.error(err);
        showNotification(err.message, 'error');
      });
  };

  const handleBasicCancel = () => {
    setBasicDetails({
      title: product.title,
      description: product.description,
      price: product.price,
      is_discounted: product.is_discounted,
      discount_amount: product.discount_amount,
      stock_quantity: product.stock_quantity,
    });
    setBasicEditMode(false);
  };

  // --- Image Handlers ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 4) {
      showNotification('You can only upload up to 4 images.', 'error');
      return;
    }
    setUploadedImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => [...prev, previewUrl]);
    });
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCropImage = (index) => {
    const imageUrl = imagePreviews[index];
    setCropModalInfo({ visible: true, imageIndex: index, imageUrl });
  };

  const handleCropCancel = () => {
    setCropModalInfo({ visible: false, imageIndex: null, imageUrl: '' });
  };

  const handleCropSave = (croppedFile, croppedImageUrl) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      newImages[cropModalInfo.imageIndex] = croppedFile;
      return newImages;
    });
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[cropModalInfo.imageIndex] = croppedImageUrl;
      return newPreviews;
    });
    setCropModalInfo({ visible: false, imageIndex: null, imageUrl: '' });
  };

  // Helper to convert URL to File object
  const urlToFile = async (url, filename, mimeType) => {
    const response = await wrapperFetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  const handlehowtoeditClick = () => {
    navigate(`/edit-article`);
  };

  const handlehowtobackClick = () => {
    navigate(`/manage-product`);
  };
  // --- Save Images Handler ---
  const handleImagesSave = async () => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('product_id', productId);

    // Convert any imageUrls to File objects before appending
    const imagesToUpload = await Promise.all(
      uploadedImages.map(async (img, index) => {
        if (typeof img === 'string') {
          return await urlToFile(img, `image_${index}.jpg`, 'image/jpeg');
        }
        return img;
      })
    );

    imagesToUpload.forEach((file) => formData.append('images', file));

   wrapperFetch(`${BASE_URL}/api/products/update`, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          showNotification(data.message, 'success');
          setImagesEditMode(false);
        } else {
          throw new Error('Failed to update images');
        }
      })
      .catch((err) => {
        console.error(err);
        showNotification(err.message, 'error');
      });
  };

  const handleImagesCancel = () => {
    if (product && product.images) {
      setImagePreviews(product.images);
      setUploadedImages(product.images);
    }
    setImagesEditMode(false);
  };

  // --- Image Context Menu Handler ---
  const handleImageContextMenu = (e, index) => {
    e.preventDefault();
    setImageContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      imageIndex: index,
    });
  };

  if (!product) {
    return <div className="loading-product-edit-charge" >Loading...</div>;
  }

  return (
    <div className="product-header">
      {/* Header and Menu */}
      <SuperHeader toggleMenu={toggleMenu} />
      <SuperMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <div className="product-edit-page">

      <h1>Edit Product</h1>
      <button onClick={handlehowtobackClick} className="How-To-Edit">
            Back
          </button>
      <button onClick={handlehowtoeditClick} className="How-To-Edit">
            How To Edit?
          </button>
      {/* Basic Details Section */}
      <section className="basic-details-section">
        <h2>Basic Details</h2>
        {basicEditMode ? (
          <div className="edit-form">
            <input
              type="text"
              value={basicDetails.title}
              onChange={(e) =>
                setBasicDetails({ ...basicDetails, title: e.target.value })
              }
            />
            <textarea
              value={basicDetails.description}
              onChange={(e) =>
                setBasicDetails({ ...basicDetails, description: e.target.value })
              }
            />
            <input
              type="number"
              value={basicDetails.price}
              onChange={(e) =>
                setBasicDetails({ ...basicDetails, price: e.target.value })
              }
            />
            <label>
              Discounted?{' '}
              <input
                type="checkbox"
                checked={basicDetails.is_discounted}
                onChange={(e) =>
                  setBasicDetails({
                    ...basicDetails,
                    is_discounted: e.target.checked,
                  })
                }
              />
            </label>
            {basicDetails.is_discounted && (
              <input
                type="number"
                value={basicDetails.discount_amount}
                onChange={(e) =>
                  setBasicDetails({
                    ...basicDetails,
                    discount_amount: e.target.value,
                  })
                }
              />
            )}
            <input
              type="number"
              value={basicDetails.stock_quantity}
              onChange={(e) =>
                setBasicDetails({
                  ...basicDetails,
                  stock_quantity: e.target.value,
                })
              }
            />
            <button onClick={handleBasicSave}>Save</button>
            <button onClick={handleBasicCancel}>Cancel</button>
          </div>
        ) : (
          <div className="display-form">
            <p>
              <strong>Title:</strong> {basicDetails.title}
            </p>
            <p>
              <strong>Description:</strong> {basicDetails.description}
            </p>
            <p>
              <strong>Price:</strong> {basicDetails.price}
            </p>
            <p>
              <strong>Discounted:</strong>{' '}
              {basicDetails.is_discounted ? 'Yes' : 'No'}
            </p>
            {basicDetails.is_discounted && (
              <p>
                <strong>Discount Amount:</strong> {basicDetails.discount_amount}
              </p>
            )}
            <p>
              <strong>Stock Quantity:</strong> {basicDetails.stock_quantity}
            </p>
            <button onClick={() => setBasicEditMode(true)}>Edit</button>
          </div>
        )}
      </section>

      {/* Images Section */}
      <section className="images-section">
        <h2>Product Images (Max 4)</h2>
        {imagesEditMode ? (
          <div className="images-edit">
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
            <div className="image-previews">
              {imagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="image-preview"
                  onContextMenu={(e) => handleImageContextMenu(e, idx)}
                >
                  <img src={src} alt={`Preview ${idx + 1}`} />
                </div>
              ))}
            </div>
            <button className="edit-images-edit-save-product" onClick={handleImagesSave}>Save Images</button>
            <button className="edit-images-edit-cancel-product" onClick={handleImagesCancel}>Cancel</button>
          </div>
        ) : (
          <div className="images-display">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Image ${idx + 1}`}
                onContextMenu={(e) => handleImageContextMenu(e, idx)}
              />
            ))}
            <button className="edit-images-edit-product" onClick={() => setImagesEditMode(true)}>Edit Images</button>
          </div>
        )}

        {/* Custom Context Menu for Images */}
        {imageContextMenu.visible && (
          <div
            className="custom-context-menu"
            ref={imageContextRef}
            style={{ top: imageContextMenu.y, left: imageContextMenu.x }}
          >
            <button
              onClick={() => {
                handleRemoveImage(imageContextMenu.imageIndex);
                setImageContextMenu({ ...imageContextMenu, visible: false });
              }}
            >
              Remove Image
            </button>
            <button
              onClick={() => {
                handleCropImage(imageContextMenu.imageIndex);
                setImageContextMenu({ ...imageContextMenu, visible: false });
              }}
            >
              Crop Image
            </button>
          </div>
        )}
      </section>

    <p className="redirect-note-for-me" > Note:You can right click on category,type and option chip to get edit and delete options. for more info <h className="redirect-note-for-me-click" onClick={handlehowtoeditClick}>click here</h></p>

      {/* Category Section */}
      <SuperCategorySection BASE_URL={BASE_URL} product={product} userId={userId} />

      {/* Types & Options Section */}
      <SuperTypeAndOption BASE_URL={BASE_URL} product={product} userId={userId} />

      {/* Type Combos Section */}
      <SuperCombo BASE_URL={BASE_URL} productId={productId} userId={userId} product={product} />

      {cropModalInfo.visible && (
        <ImageCropperModal
          imageUrl={cropModalInfo.imageUrl}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          maxWidth={500}
          maxHeight={500}
        />
      )}
    </div>
    </div>
  );
};

export default ProductEdit;
