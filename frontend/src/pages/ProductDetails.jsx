import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel.jsx";
import { useCart } from "../context/CartContext.jsx";
import {
  canAddProductToCart,
  getProductStockLimit,
} from "../utils/productStock.js";
import {
  buildProductInterestWhatsAppUrl,
  openProductInterestWhatsAppOnIos,
} from "../utils/whatsapp.js";

const API_URL = import.meta.env.VITE_API_URL;

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saleConfig, setSaleConfig] = useState(null);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [cartFeedback, setCartFeedback] = useState("");
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

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

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        setCatalogProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load products for related items", error);
      }
    };

    loadCatalog();
  }, []);

  const relatedProducts = useMemo(() => {
    if (!product?.id || !catalogProducts.length) {
      return [];
    }
    const currentId = String(product.id);
    const others = catalogProducts.filter((p) => String(p.id) !== currentId);
    const cat = (product.category || "").trim();
    const sameCategory = cat
      ? others.filter((p) => (p.category || "").trim() === cat)
      : [];
    const sameIds = new Set(sameCategory.map((p) => String(p.id)));
    const rest = others.filter((p) => !sameIds.has(String(p.id)));
    return [...sameCategory, ...rest].slice(0, 6);
  }, [product, catalogProducts]);

  if (isLoading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product?.id) {
    return (
      <div className="section">
        <p className="helper">Product not found.</p>
        <Link to="/" className="button button--outline">
          Back to home
        </Link>
      </div>
    );
  }

  const productPageUrl = window.location.href;
  const whatsappLink = buildProductInterestWhatsAppUrl(productPageUrl);
  const isSoldOut = Boolean(product.soldOut);

  const stockLine = (() => {
    if (isSoldOut) return null;
    const raw = product.stock;
    const n =
      raw === undefined || raw === null || raw === ""
        ? 1
        : Math.max(0, Math.floor(Number(raw)));
    if (!Number.isFinite(n)) {
      return null;
    }
    if (n === 0) return null;
    if (n === 1) {
      return { variant: "low", text: "Only 1 piece left" };
    }
    return { variant: "ok", count: n };
  })();

  const currentSale = saleConfig?.current || saleConfig || null;
  const isSaleActive =
    Boolean(
      currentSale?.enabled &&
      currentSale?.price &&
      currentSale?.startDate &&
      currentSale?.endDate,
    ) &&
    new Date() >= new Date(`${currentSale.startDate}T00:00:00`) &&
    new Date() <= new Date(`${currentSale.endDate}T23:59:59`);

  const originalBase = Number(product.price || product.offerPrice || 0);
  const discount = isSaleActive ? Number(currentSale.price || 0) : 0;
  const effectivePrice = isSaleActive
    ? Math.max(0, originalBase - discount)
    : Number(product.offerPrice || 0);
  const showSaleStrike = isSaleActive && discount > 0 && originalBase > 0;
  const stockLimit = getProductStockLimit(product);
  const inCartQty = getCartQuantity(product.id);
  const canAddToCart = canAddProductToCart(product) && inCartQty < stockLimit;

  const handleAddToCart = () => {
    const result = addToCart(product, {
      effectivePrice,
      pageUrl: productPageUrl,
    });
    if (result.ok) {
      setCartFeedback("Added to cart");
      window.setTimeout(() => setCartFeedback(""), 2000);
      return;
    }
    setCartFeedback(result.message || "Could not add to cart");
  };

  return (
    <>
      <section className="layout-split">
        <ImageCarousel images={product.images} />

        <div style={{ display: "grid", gap: "24px" }}>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="section-title">{product.name}</h1>
        </div>

        <div className="badge-box">
          <p className="eyebrow">Offer price</p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span className="section-title" style={{ fontSize: "28px" }}>
              {formatPrice(effectivePrice)}
            </span>
            {showSaleStrike ? (
              <span className="price--strike">{formatPrice(originalBase)}</span>
            ) : (
              product.price &&
              product.price !== product.offerPrice && (
                <span className="price--strike">
                  {formatPrice(product.price)}
                </span>
              )
            )}
          </div>
          {stockLine && (
            <p
              className={`product-detail__stock product-detail__stock--${stockLine.variant}`}
            >
              {stockLine.variant === "ok" ? (
                <>
                  In stock:{" "}
                  <strong className="product-detail__stock-count">
                    {stockLine.count}
                  </strong>
                </>
              ) : (
                stockLine.text
              )}
            </p>
          )}
        </div>

        {product.material && (
          <div>
            <p className="eyebrow">Material</p>
            <p className="section-subtitle">{product.material}</p>
          </div>
        )}

        {product.description?.trim() && (
          <div>
            <p className="eyebrow">Description</p>
            <p className="product-detail__description">{product.description}</p>
          </div>
        )}

        {isSoldOut ? (
          <button
            type="button"
            className="button button--sold-out"
            disabled
            aria-disabled="true"
          >
            Sold out
          </button>
        ) : (
          <div className="product-detail__actions">
            <button
              type="button"
              className="button button--outline product-detail__add-cart"
              disabled={!canAddToCart}
              aria-disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              {inCartQty >= stockLimit && stockLimit > 0
                ? "Max in cart"
                : "Add to cart"}
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="button card__buy product-detail__buy"
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #0f172a",
                color: "#fff",
                textDecoration: "none",
                justifyContent: "center",
              }}
              onClick={(event) => {
                event.stopPropagation();
                openProductInterestWhatsAppOnIos(event, productPageUrl);
              }}
            >
              Buy Now
            </a>
            {cartFeedback ? (
              <p className="product-detail__cart-feedback" role="status">
                {cartFeedback}
                {cartFeedback === "Added to cart" ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      className="product-detail__cart-link"
                      onClick={() => navigate("/cart")}
                    >
                      View cart
                    </button>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="home-bestseller product-details-related">
          <div className="home-section__header">
            <div>
              <p className="eyebrow">Discover more</p>
              <h2 className="home-section__title">You may also like</h2>
            </div>
          </div>
          <div
            className="home-bestseller__grid"
            aria-label="You may also like"
          >
            {relatedProducts.map((item) => (
              <article key={item.id} className="home-bestseller__card">
                <div className="home-bestseller__media">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>
                <div className="home-bestseller__body">
                  <p className="home-bestseller__title">{item.name}</p>
                  <p className="home-bestseller__text">
                    {item.material || "Signature Saiyara finish"}
                  </p>
                  <Link
                    to={`/products/${item.id}`}
                    className="button home-bestseller__button"
                  >
                    View
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetails;
