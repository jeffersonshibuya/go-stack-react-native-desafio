import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const cartItems = await AsyncStorage.getItem('@GoMarketplace:cart');
      if (cartItems) {
        setProducts([...JSON.parse(cartItems)]);
      }

      // await AsyncStorage.removeItem('@GoMarketplace:cart');
      // setProducts([]);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      // TODO ADD A NEW ITEM TO THE CART

      const productExists = products.find(p => p.id === product.id);

      if (productExists) {
        setProducts(
          products.map(p =>
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        const newProduct = { ...product, quantity: 1 };

        setProducts([...products, newProduct]);
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(products),
        );
      }

      // const productDB = products.find((p: Product) => p.id === product.id);
      // if (productDB) return;
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productDB = products.find((p: Product) => p.id === id);

      if (productDB) {
        const productsToSave = products.map(p =>
          p.id === productDB.id
            ? { ...productDB, quantity: p.quantity + 1 }
            : p,
        );

        setProducts(productsToSave);
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(productsToSave),
        );
        // items[productIndex].quantity += 1;
      }

      // setProducts([...items]);

      // const cartItems = await AsyncStorage.getItem('@GoMarketplace:cart');

      // if (cartItems) {
      //   const items = JSON.parse(cartItems);

      //   const productIndex = items.findIndex((p: Product) => p.id === id);
      //   if (productIndex !== -1) {
      //     items[productIndex].quantity += 1;
      //   }

      //   setProducts([...items]);

      //   await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(items));
      // } else {
      //   setProducts([]);
      // }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

      const productDB = products.find((p: Product) => p.id === id);

      if (productDB) {
        const productsToSave = products.map(p =>
          p.id === productDB.id
            ? { ...productDB, quantity: p.quantity > 1 ? p.quantity - 1 : 1 }
            : p,
        );

        setProducts(productsToSave);
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(productsToSave),
        );
        // items[productIndex].quantity += 1;
      }

      // const productIndex = products.findIndex((p: Product) => p.id === id);

      // const items = [...products];

      // if (productIndex !== -1) {
      //   items[productIndex].quantity > 1
      //     ? (items[productIndex].quantity -= 1)
      //     : 1;

      //   await AsyncStorage.setItem(
      //     '@GoMarketplace:cart',
      //     JSON.stringify([...items]),
      //   );
      // }

      // setProducts([...items]);

      // const cartItems = await AsyncStorage.getItem('@GoMarketplace:cart');

      // if (cartItems) {
      //   const items = JSON.parse(cartItems);

      //   const productIndex = items.findIndex((p: Product) => p.id === id);
      //   if (productIndex !== -1) {
      //     items[productIndex].quantity > 1
      //       ? (items[productIndex].quantity -= 1)
      //       : 1;
      //   }
      //   setProducts(items);
      //   await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(items));
      // }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
