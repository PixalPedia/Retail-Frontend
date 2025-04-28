import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Homepage from './pages/Homepage'; // Homepage component
import LoadPage from './pages/LoadPage'; // LoadPage component
import ProductPage from './pages/Productpage'; // ProductPage component
import LoginPage from './pages/LoginPage'; // LoginPage component
import CartPage from './pages/CartPage'; // CartPage component
import OrdersPage from './pages/OrdersPage'; // OrdersPage component
import PersonalInfoPage from './pages/PersonalInfoPage'; // PersonalInfoPage component
import MessagePage from './pages/CustomerCarePage'; // CustomerCare / MessagePage component
import AboutPage from './pages/AboutPage'; // About Page component
import ContactPage from './pages/ContactPage'; // Contact Page component
import ServicesPage from './pages/ServicesPage'; // Services Page component
import SuperDashboard from './Superuser/SuperPages/SuperDashboard'; // SuperDashboard component
import SuperUserMessagesPage from './Superuser/SuperPages/SuperMessagePage'; // SuperUserMessagesPage component
import SuperOrderMessagesPage from './Superuser/SuperPages/SuperOrderMessagePage'; // SuperOrderMessagesPage component
import RequestReportPage from './Superuser/SuperPages/RequestReportPage'; // RequestReportPage component
import FetchInfoPage from './Superuser/SuperPages/FetchInfoPage'; // FetchInfoPage component
import SuperPoster from './Superuser/SuperPages/SuperPoster'; // SuperPoster component
import AddProductPage from './Superuser/SuperPages/AddProductPage'; // AddProductPage component
import ProductEditArticlePage from './Superuser/SuperPages/ProductEditArticlePage'; // ProductEditArticlePage component
import ProductAddArticlePage from './Superuser/SuperPages/ProductAddArticlePage'; // ProductAddArticlePage component
import ManageProductPage from './Superuser/SuperPages/ManageProductsPage'; // ManageProductPage component
import FeedbackPage from './Superuser/Preview/Modals/FeedbackPage'; // FeedbackPage component
import ServiceSuper from './Superuser/Preview/Modals/ServiceSuper'; // ServiceSuper component
import SuperAbout from './Superuser/Preview/Modals/SuperAbout'; // SuperAbout component
import PreviewHomepage from './Superuser/Preview/PreviewHomepage'; // PreviewHomepage component
import PreviewLoadPage from './Superuser/Preview/PreviewLoadPage'; // PreviewLoadPage component
import PreviewProductPage from './Superuser/Preview/PreviewProductPage'; // PreviewProductPage component
import ProductEdit from './Superuser/SuperShare/ProductEdit'; // ProductEdit component
import SuperuserArticlePage from './Superuser/SuperPages/SuperuserArticlePage'; // SuperuserArticlePage component

import NotificationContainer from './components/shared/Notification'; // Global Notification container
import { NotificationProvider, useNotification } from './components/shared/NotificationContext'; // Notification Context
import './App.css'; // General styles

// Base URL for backend API
const BASE_URL = process.env.REACT_APP_BASE_URL;

// This wrapper connects the notification context with your Notification container.
const NotificationContainerWrapper = () => {
  const { notifications } = useNotification();
  return <NotificationContainer notifications={notifications} />;
};

// This inner component will run a check on every load using React Router's useNavigate.
const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for a user ID
    const userId = localStorage.getItem('userId');
    if (userId) {
      const token = localStorage.getItem('token');
      if (!token) {
        // If a user is logged in (userId exists) but the token is missing,
        // show a popup and clear the session, then redirect to login.
        alert('Session expired. Please log in again.');
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Route for Homepage */}
      <Route path="/" element={<Homepage />} />

      {/* Route for LoadPage */}
      <Route path="/loadpage" element={<LoadPage />} />

      {/* Route for ProductPage */}
      <Route path="/product/:id" element={<ProductPage BASE_URL={BASE_URL} />} />

      {/* Route for LoginPage */}
      <Route path="/login" element={<LoginPage BASE_URL={BASE_URL} />} />

      {/* Route for CartPage */}
      <Route path="/cart" element={<CartPage BASE_URL={BASE_URL} />} />

      {/* Route for OrdersPage */}
      <Route path="/orders" element={<OrdersPage BASE_URL={BASE_URL} />} />

      {/* Route for PersonalInfoPage */}
      <Route path="/personal-info" element={<PersonalInfoPage userId="user_id" BASE_URL={BASE_URL} />} />

      {/* Route for CustomerCare / MessagePage */}
      <Route path="/CustomerCare" element={<MessagePage BASE_URL={BASE_URL} />} />

      {/* Route for SuperUserMessagesPage */}
      <Route path="/super-message" element={<SuperUserMessagesPage />} />

      {/* Route for SuperOrderMessagesPage */}
      <Route path="/super-order-messages" element={<SuperOrderMessagesPage />} />

      {/* Route for AddProductPage */}
      <Route path="/add-product" element={<AddProductPage BASE_URL={BASE_URL} />} />

      {/* Route for RequestReportPage */}
      <Route path="/report" element={<RequestReportPage BASE_URL={BASE_URL} />} />

      {/* Route for ProductEdit */}
      <Route path="/product-edit/:productId" element={<ProductEdit BASE_URL={BASE_URL} />} />

      {/* Route for ManageProductPage */}
      <Route path="/manage-product" element={<ManageProductPage BASE_URL={BASE_URL} />} />

      {/* Route for SuperPoster */}
      <Route path="/add-poster" element={<SuperPoster userId="user_id" BASE_URL={BASE_URL} />} />

      {/* Route for PreviewHomepage */}
      <Route path="/preview" element={<PreviewHomepage />} />

      {/* Route for PreviewLoadPage */}
      <Route path="/preview-load" element={<PreviewLoadPage />} />

      {/* Route for PreviewProductPage */}
      <Route path="/preview-product/:id" element={<PreviewProductPage BASE_URL={BASE_URL} />} />

      {/* Route for FetchInfoPage */}
      <Route path="/info" element={<FetchInfoPage BASE_URL={BASE_URL} />} />

      {/* Route for ProductEditArticlePage */}
      <Route path="/edit-article" element={<ProductEditArticlePage />} />

      {/* Route for ProductAddArticlePage */}
      <Route path="/add-article" element={<ProductAddArticlePage />} />

      {/* Route for SuperuserArticlePage */}
      <Route path="/super-article" element={<SuperuserArticlePage />} />

      {/* Route for AboutPage */}
      <Route path="/about" element={<AboutPage />} />

      {/* Route for ContactPage */}
      <Route path="/contact" element={<ContactPage />} />

      {/* Route for FeedbackPage */}
      <Route path="/feedback" element={<FeedbackPage />} />

      {/* Route for ServiceSuper */}
      <Route path="/super-service" element={<ServiceSuper />} />

      {/* Route for SuperAbout */}
      <Route path="/super-about" element={<SuperAbout />} />

      {/* Route for ServicesPage */}
      <Route path="/services" element={<ServicesPage />} />

      {/* Route for SuperDashboard */}
      <Route path="/superdashboard" element={<SuperDashboard />} />
    </Routes>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <Router>
        {/* Global Notification Container */}
        <NotificationContainerWrapper />
        {/* AppContent will perform the session check and render routes */}
        <AppContent />
      </Router>
    </NotificationProvider>
  );
};

export default App;
