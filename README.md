/src
│
├── /assets                # Images, icons, fonts, etc.
│
├── /components            # Reusable UI components
│   ├── Button/
│   │   └── Button.jsx
│   │   └── Button.css
│   ├── Input/
│   │   └── Input.jsx
│   │   └── Input.css
│   ├── Dropdown/
│   ├── Modal/
│   ├── Loader/
│   ├── StarRating/
│   ├── Breadcrumbs/
│   ├── Notification/
│   └── ...
│
├── /layouts               # Layout components used on all/some pages
│   ├── Header/
│   │   └── Header.jsx
│   │   └── Header.css
│   ├── Footer/
│   ├── Sidebar/           # For Shop filters sidebar, etc.
│   └── ...
│
├── /pages                 # Page components (routes)
│   ├── HomePage/
│   │   └── HomePage.jsx
│   │   └── HomePage.css
│   │   └── components/        # Home page specific components
│   │       ├── HeroBanner.jsx
│   │       ├── FeaturedCategories.jsx
│   │       ├── BestSellersCarousel.jsx
│   │       ├── WhyChooseUs.jsx
│   │       ├── TestimonialsSlider.jsx
│   │       └── NewsletterSignupForm.jsx
│   │
│   ├── ShopPage/
│   │   ├── ShopPage.jsx
│   │   ├── ShopPage.css
│   │   └── components/
│   │       ├── FiltersSidebar.jsx
│   │       ├── FilterByMakeModel.jsx
│   │       ├── FilterByCategory.jsx
│   │       ├── PriceRangeSlider.jsx
│   │       ├── FilterByBrand.jsx
│   │       ├── FilterByCondition.jsx
│   │       ├── SortDropdown.jsx
│   │       ├── ProductGrid.jsx
│   │       └── Pagination.jsx
│   │
│   ├── ProductDetailPage/
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductDetailPage.css
│   │   └── components/
│   │       ├── ProductImageGallery.jsx
│   │       ├── ProductInfo.jsx
│   │       ├── CompatibilityChecker.jsx
│   │       ├── ProductReviews.jsx
│   │       └── RelatedProducts.jsx
│   │
│   ├── CartPage/
│   │   ├── CartPage.jsx
│   │   ├── CartPage.css
│   │   └── components/
│   │       ├── CartItemList.jsx
│   │       ├── CartItem.jsx
│   │       ├── PromoCodeInput.jsx
│   │       ├── CartSummary.jsx
│   │       └── CheckoutButton.jsx
│   │
│   ├── CheckoutPage/
│   │   ├── CheckoutPage.jsx
│   │   ├── CheckoutPage.css
│   │   └── components/
│   │       ├── ShippingForm.jsx
│   │       ├── ShippingOptions.jsx
│   │       ├── PaymentForm.jsx
│   │       ├── OrderSummary.jsx
│   │       └── PlaceOrderButton.jsx
│   │
│   ├── AccountDashboardPage/
│   │   ├── AccountDashboardPage.jsx
│   │   ├── AccountDashboardPage.css
│   │   └── components/
│   │       ├── OrderHistory.jsx
│   │       ├── Wishlist.jsx
│   │       ├── ProfileDetailsForm.jsx
│   │       └── ChangePasswordForm.jsx
│   │
│   ├── LoginPage/
│   │   ├── LoginPage.jsx
│   │   └── LoginForm.jsx
│   │
│   ├── RegisterPage/
│   │   ├── RegisterPage.jsx
│   │   └── RegisterForm.jsx
│   │
│   ├── AboutPage/
│   │   ├── AboutPage.jsx
│   │   ├── CompanyOverview.jsx
│   │   ├── TeamInfo.jsx
│   │   └── LocationMap.jsx
│   │
│   ├── ContactPage/
│   │   ├── ContactPage.jsx
│   │   ├── ContactForm.jsx
│   │   ├── ContactDetails.jsx
│   │   └── GoogleMapEmbed.jsx
│   │
│   ├── BlogListingPage/
│   │   ├── BlogListingPage.jsx
│   │   ├── BlogPostList.jsx
│   │   ├── BlogCategoriesFilter.jsx
│   │   └── BlogSearchBar.jsx
│   │
│   ├── BlogPostPage/
│   │   ├── BlogPostPage.jsx
│   │   ├── BlogPostContent.jsx
│   │   └── CommentsSection.jsx
│   │
│   └── FAQPage/
│       ├── FAQPage.jsx
│       └── FAQList.jsx
│
├── /services              # API calls, auth, payment, etc.
│   ├── api.js
│   ├── auth.js
│   └── payment.js
│
├── /context               # React Context providers for global state
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── NotificationContext.jsx
│
├── /hooks                 # Custom React hooks
│   └── useFetch.js
│
├── /utils                 # Helper functions
│
├── App.jsx
├── index.js
└── routes.jsx             # React Router configuration