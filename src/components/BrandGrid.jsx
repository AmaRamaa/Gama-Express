import React from "react";
import BrandCard from "./BrandCard";

const BrandGrid = ({
  brands = [],
  selectedBrand,
  onBrandClick,
  headerRed = "#e53935",
  headerRedLight = "#ffeaea",
  showImage = true,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "28px",
      padding: "0 32px 32px 32px",
    }}
  >
    {brands.map((brandObj, idx) => (
      <BrandCard
        key={idx}
        brand={brandObj}
        selected={
          selectedBrand &&
          (brandObj.name || brandObj.manufacturer) === selectedBrand
        }
        onClick={() => onBrandClick(brandObj)}
        headerRed={headerRed}
        headerRedLight={headerRedLight}
        showImage={showImage}
      />
    ))}
  </div>
);

export default BrandGrid;