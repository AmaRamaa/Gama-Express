import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ShopPage from './pages/ShopPage/ShopPage'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </Router>
  )
}

export default App
