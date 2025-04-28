import React, { useState, useEffect } from 'react';
import { fetchUserInfo, updateUserInfo } from '../components/shared/DeliveryUtils';
import Menu from '../components/shared/Menu';
import Header from '../components/shared/Header';
import CartSlider from '../components/shared/CartSlider';
import Notification from '../components/shared/Notification';
import RequestEmailVerification from '../components/auth/RequestEmailVerification';
import RequestPasswordReset from '../components/auth/RequestPasswordReset';
import ResetPassword from '../components/auth/ResetPassword';
import VerifyMail from '../components/auth/VerifyMail'; // Updated component for email verification
import '../components/styles/PersonalInfoPage.css';
import { wrapperFetch } from '../utils/wrapperfetch';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PersonalInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null); // Delivery info
  const [detailedInfo, setDetailedInfo] = useState(null); // Username and email info
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error state
  const [notification, setNotification] = useState({ message: '', type: '' }); // Notification state
  const [isEditing, setIsEditing] = useState(false); // Toggle editing mode
  const [formData, setFormData] = useState({});  // Form data for user inputs
  const [currentForm, setCurrentForm] = useState('info'); // Manage current form state
  const [email, setEmail] = useState(''); // Email state for forms
  const [otp, setOtp] = useState(''); // OTP state for verification and reset
  const [isCartOpen, setIsCartOpen] = useState(false); // Cart Slider visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu visibility state

  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

  // Function to display notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Auto-clear after 3 seconds
  };

  // Fetch user data on component mount
  useEffect(() => {
    if (!userId) {
      setError('User ID not found. Please login.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const deliveryData = await FetchUserInfo(userId); // Fetch delivery info
        setUserInfo(deliveryData);
        setFormData(deliveryData);
        const detailedData = await FetchDetailedUserInfo(userId); // Fetch detailed user info
        setDetailedInfo(detailedData.user);
        setEmail(detailedData.user.email || ''); // Set email for forms
      } catch (err) {
        setError(err.message || 'Failed to fetch user information.');
        showNotification(err.message || 'Failed to fetch user information.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchDetailedUserInfo = async (userId) => {
    try {
      const response = await wrapperFetch(`${BASE_URL}/api/info/get/detailed/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch detailed user information.');
      }
    } catch (error) {
      console.error('Error fetching detailed user information:', error);
      throw error;
    }
  };

  // Handle input changes for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the user form to update info
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserInfo(userId, formData); // Update user info via API
      setUserInfo(formData);
      setIsEditing(false); // Exit editing mode
      showNotification(response.message || 'Address updated successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to update address.');
      showNotification(err.message || 'Failed to update address.', 'error');
    }
  };

  // Toggle menu visibility
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  // Toggle cart visibility
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const renderForm = () => {
    if (currentForm === 'email-verification') {
      return (
        <VerifyMail
          BASE_URL={BASE_URL}
          email={email}
          otp={otp}
          setOtp={setOtp}
          setCurrentForm={setCurrentForm}
        />
      );
    }

    if (currentForm === 'request-password-reset') {
      return (
        <RequestPasswordReset
          BASE_URL={BASE_URL}
          email={email}
          setEmail={setEmail}
          setSuccessMessage={(msg) => showNotification(msg, 'success')}
          setErrorMessage={(msg) => showNotification(msg, 'error')}
          setCurrentForm={setCurrentForm}
        />
      );
    }

    if (currentForm === 'password-reset') {
      return (
        <ResetPassword
          BASE_URL={BASE_URL}
          email={email}
          otp={otp}
          setOtp={setOtp}
          setSuccessMessage={(msg) => showNotification(msg, 'success')}
          setErrorMessage={(msg) => showNotification(msg, 'error')}
          setCurrentForm={setCurrentForm}
        />
      );
    }

    if (currentForm === 'request-email-verification') {
      return (
        <RequestEmailVerification
          BASE_URL={BASE_URL}
          email={email}
          setEmail={setEmail}
          setSuccessMessage={(msg) => {
            showNotification(msg, 'success');
            setCurrentForm('email-verification');
          }}
          setErrorMessage={(msg) => {
            if (msg === 'This email is already verified.') {
              showNotification('Email is already verified. No further action needed.', 'info');
            } else {
              showNotification(msg, 'error');
            }
          }}
          setCurrentForm={setCurrentForm}
        />
      );
    }

    // Default: Personal Information Form
    return (
      <div className="personal-info-content">
        <h1 className="personal-info-title">Personal Information</h1>
        {detailedInfo && (
          <div className="info-display">
            <p><strong>Username:</strong> {detailedInfo.username || 'N/A'}</p>
            <p><strong>Email:</strong> {detailedInfo.email || 'N/A'}</p>
          </div>
        )}
        {!isEditing ? (
          <div className="info-display">
            <p><strong>Phone Number:</strong> {userInfo?.phone_number || 'N/A'}</p>
            <p><strong>Apartment/Home:</strong> {userInfo?.apartment_or_home || 'N/A'}</p>
            <p><strong>Address Line1:</strong> {userInfo?.address_line_1 || 'N/A'}</p>
            <p><strong>Address Line2:</strong> {userInfo?.address_line_2 || 'N/A'}</p>
            <p><strong>City:</strong> {userInfo?.city || 'N/A'}</p>
            <p><strong>State:</strong> {userInfo?.state || 'N/A'}</p>
            <p><strong>Country:</strong> {userInfo?.country || 'N/A'}</p>
            <p><strong>Postal Code:</strong> {userInfo?.postal_code || 'N/A'}</p>
            <button className="edit-address-button" onClick={() => setIsEditing(true)}>
              Edit Address
            </button>
          </div>
        ) : (
          <form className="info-form" onSubmit={handleFormSubmit}>
            <label>
              Phone Number:
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Apartment/Home:
              <input
                type="text"
                name="apartment_or_home"
                value={formData.apartment_or_home || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address Line1:
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1 || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address Line2:
              <input
                type="text"
                name="address_line_2"
                value={formData.address_line_2 || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Postal Code:
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code || ''}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit" className="edit-address-button">
              Save
            </button>
            <button
              type="button"
              className="edit-address-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}
        {/* Buttons for Reset Password and Verify Email */}
        <div className="action-buttons">
          <button
            className="action-button-reset-password"
            onClick={() => setCurrentForm('request-password-reset')}
          >
            Reset Password
          </button>
          <button
            className="action-button-Email-Own"
            onClick={() => setCurrentForm('request-email-verification')}
          >
            Verify Email
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) return <p className="loading-info-for-user">Loading information...</p>;
  if (error) {
    showNotification(error, 'error');
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      {/* Header Component */}
      <Header toggleMenu={toggleMenu} toggleCart={toggleCart} />
      {/* Menu Component */}
      <Menu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      {/* Cart Slider Component */}
      <CartSlider isCartOpen={isCartOpen} toggleCart={toggleCart} cartItems={[]} />
      {/* Notification Component */}
      <Notification message={notification.message} type={notification.type} />
      {/* Main Content */}
      <div className="personal-info-page">
        {renderForm()}
      </div>
    </div>
  );
};

export default PersonalInfoPage;
