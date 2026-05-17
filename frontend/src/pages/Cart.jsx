import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import DeleteIcon from "../components/DeleteIcon.jsx";
import EmptyCartIllustration from "../components/EmptyCartIllustration.jsx";
import {
  buildCartCheckoutWhatsAppUrl,
  openCartCheckoutWhatsAppOnIos,
} from "../utils/whatsapp.js";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const Cart = () => {
  const { items, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const checkoutItems = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    pageUrl: item.pageUrl,
  }));

  const whatsappUrl = buildCartCheckoutWhatsAppUrl(checkoutItems);

  const handleCheckout = (event) => {
    openCartCheckoutWhatsAppOnIos(event, checkoutItems);
  };

  if (!items.length) {
    return (
      <section className="cart-page cart-page--empty" aria-label="Empty cart">
        <EmptyCartIllustration />
        <h1 className="cart-empty__title">Your cart is empty!</h1>
        <p className="cart-empty__text">
          Looks like you haven&apos;t added anything to your cart yet
        </p>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page__header">
        <h1 className="section-title">Your cart</h1>
        <p className="section-subtitle">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.productId} className="cart-item">
            <Link
              to={`/products/${item.productId}`}
              className="cart-item__media"
            >
              {item.image ? (
                <img src={item.image} alt={item.name} loading="lazy" />
              ) : (
                <div className="cart-item__placeholder" aria-hidden="true" />
              )}
            </Link>
            <div className="cart-item__body">
              <Link
                to={`/products/${item.productId}`}
                className="cart-item__title"
              >
                {item.name}
              </Link>
              <p className="cart-item__price">
                {formatPrice(item.price)}
                {item.quantity > 1 ? (
                  <span className="cart-item__line-total">
                    {" "}
                    · {formatPrice(item.price * item.quantity)}
                  </span>
                ) : null}
              </p>
              <div className="cart-item__controls">
                <div className="qty-control" aria-label="Quantity">
                  <button
                    type="button"
                    className="qty-control__btn"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="qty-control__value">{item.quantity}</span>
                  <button
                    type="button"
                    className="qty-control__btn"
                    aria-label="Increase quantity"
                    disabled={item.quantity >= item.maxStock}
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeFromCart(item.productId)}
                >
                  <DeleteIcon />
                </button>
              </div>
              {item.quantity >= item.maxStock ? (
                <p className="cart-item__stock-note">
                  Max {item.maxStock} in stock
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="button button--primary cart-summary__checkout"
          onClick={handleCheckout}
        >
          Checkout on WhatsApp
        </a>
        <p className="helper cart-summary__note">
          You will be redirected to WhatsApp with your cart items and product
          links.
        </p>
      </div>
    </section>
  );
};

export default Cart;
