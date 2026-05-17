import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Admin from "./pages/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import NewArrivals from "./pages/NewArrivals.jsx";
import Contact from "./pages/Contact.jsx";
import { CartProvider, useCart } from "./context/CartContext.jsx";
import { isAuthed, subscribeToAuth } from "./utils/auth.js";
import { CATEGORY_OPTIONS } from "./utils/catalog.js";
import logo from "./assets/logo1.png";
import SiteFooter from "./components/SiteFooter.jsx";
import FloatingInstagramButton from "./components/FloatingInstagramButton.jsx";
import CartIcon from "./components/CartIcon.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const HeaderCartLink = () => {
  const { itemCount } = useCart();

  return (
    <Link to="/cart" className="cart-button" aria-label="View cart">
      <CartIcon />
      {itemCount > 0 ? (
        <span className="cart-button__badge" aria-hidden="true">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
};

const App = () => {
  const [authed, setAuthed] = useState(isAuthed());
  const [saleConfig, setSaleConfig] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => subscribeToAuth(setAuthed), []);

  useEffect(() => {
    const loadSale = async () => {
      try {
        const response = await fetch(`${API_URL}/sale`);
        const data = await response.json();
        setSaleConfig(data);
      } catch (error) {
        console.error("Failed to load sale config", error);
      }
    };

    loadSale();
  }, []);

  const currentSale = saleConfig?.current || saleConfig || null;
  const isSaleActive = useMemo(() => {
    if (
      currentSale?.enabled !== true ||
      !currentSale?.startDate ||
      !currentSale?.endDate
    ) {
      return false;
    }
    const start = new Date(`${currentSale.startDate}T00:00:00`);
    const end = new Date(`${currentSale.endDate}T23:59:59`);
    const now = new Date();
    return now >= start && now <= end;
  }, [currentSale]);
  const bannerText = isSaleActive
    ? currentSale?.bannerText ||
      currentSale?.message ||
      currentSale?.description ||
      (currentSale?.name ? `${currentSale.name} is live now` : "")
    : "";

  return (
    <CartProvider>
      <div className="page">
        {bannerText && (
          <div className="top-banner" role="status" aria-live="polite">
            <div className="top-banner__track">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={`banner-${index}`} className="top-banner__item">
                  {bannerText}
                </span>
              ))}
            </div>
          </div>
        )}
        <header className="site-header">
          <div className="container site-header__inner">
            <button
              type="button"
              className="menu-button"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>
            <Link to="/" className="brand brand--title">
              <img src={logo} alt="Saiyara" className="brand__logo" />
            </Link>
            <HeaderCartLink />
          </div>
        </header>
        <div className={`menu-overlay ${isMenuOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="menu-overlay__backdrop"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="menu-drawer" aria-label="Sidebar">
            <div className="menu-drawer__header">
              <button
                type="button"
                className="menu-drawer__close"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
              >
                ×
              </button>
            </div>
            <nav className="menu-drawer__list">
              <Link
                to="/"
                className="menu-drawer__link"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/new-arrivals"
                className="menu-drawer__link"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                to="/contact"
                className="menu-drawer__link"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
            <div className="menu-drawer__divider" />
            <p className="menu-drawer__section-title">Categories</p>
            <nav className="menu-drawer__list">
              {CATEGORY_OPTIONS.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="menu-drawer__link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>

        <main className="container section">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={authed ? <Admin /> : <Navigate to="/admin/login" />}
            />
          </Routes>
        </main>

        <SiteFooter />
        <FloatingInstagramButton />
      </div>
    </CartProvider>
  );
};

export default App;
