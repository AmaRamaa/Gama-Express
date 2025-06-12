import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ShopPage from './pages/ShopPage/Manufactures'
import Models from './pages/ShopPage/Models'
import ProductDetails from './pages/ShopPage/ProductsDetails'
import Home from './pages/HomePage/Home'
import Header from './layouts/Header/Header'
import Footer from './layouts/Footer/Footer'
import Testing from './pages/TestingPage/Testing'
import Breadcrumbs from './layouts/BreadCrums/BreadCrums'
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout>
              {/* Your dashboard content here */}
            </DashboardLayout>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Header />
              <Breadcrumbs />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/catalog" element={<ShopPage />} />
                <Route path="/catalog/:manufacturer" element={<Models />} />
                <Route path="/catalog/:category/:subcategory/:product" element={<ProductDetails />} />
                <Route path="/testing" element={<Testing />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
