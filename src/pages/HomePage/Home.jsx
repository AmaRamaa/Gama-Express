import React, { useEffect, useState } from "react";
import GamaLogo from "../../assets/GamaExpressLogo1.png";
import { supabase } from "../../supaBase/supaBase";
import ProductCard from "../../components/ProductCard";
import BrandGrid from "../../components/BrandGrid";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "react-js-pagination";
import { useTranslation } from 'react-i18next';
import '../../i18n';

// Styles
const styles = {
  page: {
    fontFamily: "Inter, Arial, sans-serif",
    background: "linear-gradient(135deg, #f8f8f8 60%, #e0e7ff 100%)",
    minHeight: "100vh",
    padding: 0,
    margin: 0,
  },
  heroSection: {
    maxWidth: "2400px",
    // margin: "48px auto 32px",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(80,80,180,0.07)",
    padding: 32,
    textAlign: "center",
  },
  logo: {
    width: 240,
    maxWidth: "90%",
    marginBottom: 24,
    filter: "drop-shadow(0 2px 8px #e0e7ff)",
  },
  heroText: {
    color: "#222",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  heroSubText: {
    color: "#444",
    fontSize: 16,
    marginBottom: 18,
  },
  warehouseImg: {
    width: 320,
    maxWidth: "100%",
    marginTop: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(80,80,180,0.10)",
  },
  sectionTitle: {
    fontSize: 24,
    color: "#6366f1",
    fontWeight: 700,
    letterSpacing: 1,
    textAlign: "center",
    margin: "32px auto 16px",
    textShadow: "0 2px 8px #e0e7ff",
  },
  gridSection: {
    maxWidth: 1200,
    margin: "0 auto 48px",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(80,80,180,0.07)",
    padding: "32px 24px",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 28,
    marginTop: 16,
  },
};

// Home Page Component
export default function Home() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchBrands() {
      const { data, error } = await supabase.from("Manufacturers").select("*");
      if (!error && data) setBrands(data);
    }
    async function fetchProducts() {
      const { data, error } = await supabase.from("Parts").select("*");
      if (!error && data) setProducts(data);
    }
    fetchBrands();
    fetchProducts();
  }, []);

// Pagination state
const [activePage, setActivePage] = useState(1);
const itemsPerPage = 8;

// Calculate paginated products
const paginatedProducts = products.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
);

return (
    <div style={styles.page}>
        {/* Hero Section */}
        <section
            style={{
                ...styles.heroSection,
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden",
                padding: 0,
                alignContent: "center",
                alignItems: "center",
            }}
        >
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
                src="https://www.w3schools.com/howto/rain.mp4"
            />
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "50%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.65)",
                    padding: "16px 32px 32px 32px",
                    borderRadius: 16,
                }}
            >
                <img src={GamaLogo} alt="Gama Express Logo" style={styles.logo} />
                <p style={styles.heroText}>
                    {t('home.heroText', 'Welcome to Gama Express – your one-stop destination for premium auto parts!')}
                </p>
                <p style={styles.heroSubText}>
                    {t('home.heroSubText', 'Browse through our vast inventory, discover unbeatable deals, and enjoy fast service backed by a passionate team ready to help you.')}
                </p>
            </div>
        </section>
        <h2 style={styles.sectionTitle}>{t('home.popularBrands', 'Popular Brands')}</h2>
        <section style={styles.gridSection}>
            <BrandGrid
                brands={[...brands].slice(0, 10)}
                onBrandClick={async brand => {
                    if (brand && brand.id) {
                        const { data, error } = await supabase
                            .from("Parts")
                            .select("*")
                            .limit(10);
                        if (!error && data) setProducts(data);
                    } else {
                        // If no brand selected, fetch first 10 products
                        const { data, error } = await supabase
                            .from("Parts")
                            .select("*")
                            .limit(10);
                        if (!error && data) setProducts(data);
                    }
                }}
            />
        </section>
        <h2 style={styles.sectionTitle}>{t('home.latestProducts', 'Latest Products')}</h2>
        <section style={styles.gridSection}>
            <div style={styles.productsGrid}>
                {paginatedProducts.map((product, idx) => (
                    <ProductCard key={product.id || idx} product={product} />
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={products.length}
                    pageRangeDisplayed={5}
                    onChange={page => setActivePage(page)}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            </div>
        </section>
    </div>
);
}
