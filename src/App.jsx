import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './layouts/Header/Header'

import HomePage from './pages/HomePage/HomePage'
import ShopPage from './pages/ShopPage/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import CartPage from './pages/CartPage/CartPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import AccountDashboardPage from './pages/AccountDashboardPage/AccountDashboardPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import AboutPage from './pages/AboutPage/AboutPage'
import ContactPage from './pages/ContactPage/ContactPage'
import BlogListingPage from './pages/BlogListingPage/BlogListingPage'
import BlogPostPage from './pages/BlogPostPage/BlogPostPage'
import FAQPage from './pages/FAQPage/FAQPage'
import Footer from './layouts/Footer/Footer'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
