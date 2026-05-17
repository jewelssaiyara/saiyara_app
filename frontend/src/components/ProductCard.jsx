import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import {
  canAddProductToCart,
  getProductStockLimit,
} from "../utils/productStock.js";
import {
  buildProductInterestWhatsAppUrl,
  openProductInterestWhatsAppOnIos,
} from "../utils/whatsapp.js";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const ProductCard = ({ product, sale }) => {
  const { addToCart, getCartQuantity } = useCart();
  const isSaleActive = Boolean(sale?.isActive && sale?.price);
  const originalBase = Number(product.price || product.offerPrice || 0);
  const discount = isSaleActive ? Number(sale.price) : 0;
  const effectivePrice = isSaleActive
    ? Math.max(0, originalBase - discount)
    : Number(product.offerPrice || 0);
  const showSaleStrike = isSaleActive && discount > 0 && originalBase > 0;

  const productPageUrl = `${window.location.origin}/products/${product.id}`;
  const whatsappUrl = buildProductInterestWhatsAppUrl(productPageUrl);
  const isSoldOut = Boolean(product.soldOut);
  const stockLimit = getProductStockLimit(product);
  const inCartQty = getCartQuantity(product.id);
  const canAddToCart =
    canAddProductToCart(product) && inCartQty < stockLimit;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, {
      effectivePrice,
      pageUrl: productPageUrl,
    });
  };

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card__link-block">
        <div className="card__media">
          <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        </div>
        <div className="card__body">
          <div>
            <p className="eyebrow">{product.name}</p>
          </div>
          <div className="card__price">
            <span>{formatPrice(effectivePrice)}</span>
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
        </div>
      </Link>
      <div className="card__actions">
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
          <>
            <button
              type="button"
              className="button button--outline card__add-cart"
              disabled={!canAddToCart}
              aria-disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              {inCartQty >= stockLimit && stockLimit > 0
                ? "Max in cart"
                : "Add to cart"}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button card__buy"
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #0f172a",
                color: "#fff",
                textDecoration: "none",
              }}
              onClick={(event) => {
                event.stopPropagation();
                openProductInterestWhatsAppOnIos(event, productPageUrl);
              }}
            >
              Buy now
            </a>
          </>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
