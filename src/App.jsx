import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ShopPage from './pages/ShopPage/Manufactures'
import Models from './pages/ShopPage/Models'
import ProductDetails from './pages/ShopPage/ProductsDetails'
import Home from './pages/HomePage/Home'
import Header from './layouts/Header/Header'
import Footer from './layouts/Footer/Footer'
function App() {
  return (
<Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<ShopPage />} />
        <Route path="/catalog/:manufacturer" element={<Models />} />
        <Route path="/catalog/:category/:subcategory/:product" element={<ProductDetails />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
