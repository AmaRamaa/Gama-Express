import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import ManufacturersPage from "./pages/ShopPage/Manufactures"
import Models from "./pages/ShopPage/Models"
import ProductDetails from "./pages/ShopPage/ProductsDetails"
import Home from "./pages/HomePage/Home"
import Header from "./layouts/Header/Header"
import Footer from "./layouts/Footer/Footer"
import Testing from "./pages/TestingPage/Testing"
import Breadcrumbs from "./layouts/BreadCrums/BreadCrums"
import { supabase } from "./supaBase/supaBase"
import SearchResultsPage from "./pages/ShopPage/SearchResultsPage"
import DashboardRouting from "./dashboard/DashboardRouting"
import Auth from "./pages/Auth/Auth"
import Profile from "./pages/Auth/Profile" 

function CatalogManufacturersWrapper() {
  const [manufacturers, setManufacturers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const headerRed = "#e53935"
  const navigate = useNavigate()
  const location = useLocation()

  // Get search query from URL
  const params = new URLSearchParams(location.search)
  const searchQuery = params.get("search")?.toLowerCase() || ""

  useEffect(() => {
    if (searchQuery) {
      setLoading(true)
      const fetchProducts = async () => {
        const { data, error } = await supabase
          .from("Parts")
          .select("*")
        if (error) {
            setProducts([])
          } else {
            // Filter products if the full search query matches any field
            setProducts(
              (data || []).filter(product =>
              (product.Car?.toLowerCase().includes(searchQuery)) ||
              (product.AM?.toLowerCase().includes(searchQuery)) ||
              (product.OEM?.toLowerCase().includes(searchQuery)) ||
              (product.Description?.toLowerCase().includes(searchQuery)) ||
              (product.manufacturer?.toLowerCase().includes(searchQuery)) ||
              (product.model?.toLowerCase().includes(searchQuery)) ||
              (product.Variant?.toLowerCase().includes(searchQuery)) ||
              (product.Year?.toLowerCase().includes(searchQuery)) ||
              (product.Category?.toLowerCase().includes(searchQuery)) ||
              (product.Subcategory?.toLowerCase().includes(searchQuery))
              )
            )
        }
        setLoading(false)
      }
      fetchProducts()
    } else {
      const fetchManufacturers = async () => {
        const { data } = await supabase.from("Manufacturers").select("*")
        setManufacturers(data || [])
      }
      fetchManufacturers()
    }
  }, [searchQuery])

  const handleBrandClick = (brand) => {
    // Navigate to /catalog/:manufacturer
    navigate(`/catalog/${encodeURIComponent(brand.manufacturer || brand.name)}`)
  }

  if (searchQuery) {
    return (
      <SearchResultsPage
        loading={loading}
        filteredProducts={products}
        headerRed={headerRed}
      />
    )
  }

  return (
    <ManufacturersPage
      manufacturers={manufacturers}
      onBrandClick={handleBrandClick}
      headerRed={headerRed}
    />
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/*" element={<DashboardRouting />} />
        <Route
          path="*"
          element={
            <>
              <Header />
              <Breadcrumbs />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<CatalogManufacturersWrapper />} />
                <Route path="/catalog/:manufacturer" element={<Models />} />
                <Route path="/catalog/:manufacturer/:model" element={<Models />} />
                <Route
                  path="/catalog/:category/:subcategory/:product"
                  element={<ProductDetails />}
                />
                <Route path="/testing" element={<Testing />} />
                <Route path="/Login" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                {/* Dashboard routes without Header/Footer */}
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
