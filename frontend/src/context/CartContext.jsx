import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProductStockLimit } from "../utils/productStock.js";

const STORAGE_KEY = "saiyara_cart";

const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeItem = (item) => ({
  productId: String(item.productId),
  name: item.name || "Product",
  image: item.image || "",
  price: Number(item.price) || 0,
  quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
  pageUrl: item.pageUrl || "",
  maxStock: Math.max(1, Math.floor(Number(item.maxStock) || 1)),
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStoredCart().map(normalizeItem));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const getCartQuantity = useCallback(
    (productId) =>
      items.find((item) => item.productId === String(productId))?.quantity || 0,
    [items],
  );

  const addToCart = useCallback((product, { effectivePrice, pageUrl }) => {
    const maxStock = getProductStockLimit(product);
    if (maxStock <= 0) {
      return { ok: false, message: "This item is out of stock." };
    }

    const productId = String(product.id);
    let added = false;

    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      const inCart = existing?.quantity || 0;

      if (inCart >= maxStock) {
        return current;
      }

      added = true;

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, maxStock }
            : item,
        );
      }

      return [
        ...current,
        normalizeItem({
          productId,
          name: product.name,
          image: product.images?.[0] || "",
          price: effectivePrice,
          quantity: 1,
          pageUrl,
          maxStock,
        }),
      ];
    });

    if (!added) {
      return {
        ok: false,
        message: `Only ${maxStock} available in stock.`,
      };
    }

    return { ok: true };
  }, []);

  const updateQuantity = useCallback((productId, nextQuantity) => {
    const id = String(productId);
    setItems((current) => {
      const existing = current.find((item) => item.productId === id);
      if (!existing) {
        return current;
      }

      const qty = Math.floor(Number(nextQuantity));
      if (!Number.isFinite(qty) || qty <= 0) {
        return current.filter((item) => item.productId !== id);
      }

      const capped = Math.min(qty, existing.maxStock);
      return current.map((item) =>
        item.productId === id ? { ...item, quantity: capped } : item,
      );
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    const id = String(productId);
    setItems((current) => current.filter((item) => item.productId !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartQuantity,
    }),
    [
      items,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
