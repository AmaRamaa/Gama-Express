#!/bin/bash

# Set base directory
BASE_DIR="src/pages"

# Define pages and subcomponents
declare -A pages=(
  ["HomePage"]="HeroBanner SearchBar FeaturedCategories BestSellersCarousel WhyChooseUs TestimonialsSlider NewsletterSignupForm"
  ["ShopPage"]="FiltersSidebar FilterByMakeModel FilterByCategory PriceRangeSlider FilterByBrand FilterByCondition SortDropdown ProductGrid Pagination"
  ["ProductDetailPage"]="ProductImageGallery ProductInfo CompatibilityChecker ProductReviews RelatedProducts"
  ["CartPage"]="CartItemList PromoCodeInput CartSummary CheckoutButton"
  ["CheckoutPage"]="ShippingForm ShippingOptions PaymentForm OrderSummary PlaceOrderButton"
  ["AccountDashboardPage"]="OrderHistory Wishlist ProfileDetailsForm ChangePasswordForm"
  ["LoginPage"]="LoginForm"
  ["RegisterPage"]="RegisterForm"
  ["AboutPage"]="CompanyOverview TeamInfo LocationMap"
  ["ContactPage"]="ContactForm ContactDetails GoogleMapEmbed"
  ["BlogListingPage"]="BlogPostList BlogCategoriesFilter BlogSearchBar"
  ["BlogPostPage"]="BlogPostContent CommentsSection"
  ["FAQPage"]="FAQList"
)

# Create folders and files
for page in "${!pages[@]}"; do
  PAGE_DIR="$BASE_DIR/$page"
  COMPONENT_DIR="$PAGE_DIR/components"

  mkdir -p "$COMPONENT_DIR"

  # Create main page file
  touch "$PAGE_DIR/${page}.jsx"
  echo "Created: $PAGE_DIR/${page}.jsx"

  # Create component files
  for component in ${pages[$page]}; do
    COMPONENT_FILE="$COMPONENT_DIR/${component}.jsx"
    touch "$COMPONENT_FILE"
    echo "Created: $COMPONENT_FILE"
  done
done
