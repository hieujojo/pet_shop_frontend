'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

// Định nghĩa kiểu dữ liệu cho sản phẩm từ API order_products
interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Định nghĩa kiểu dữ liệu cho sản phẩm từ API products
interface Product {
  _id: string;
  image: string;
  brand: string;
  title: string;
  originalPrice: string;
}

// Định nghĩa kiểu dữ liệu cho CartItem
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  syncCart: () => Promise<void>;
  clearCart: () => void;
  placeOrder: (items: CartItem[], address: string, phone: string, email: string) => Promise<{ orderCode: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const mergeCartItems = async (items: CartItem[]): Promise<CartItem[]> => {
    const itemMap = new Map<string, CartItem>();
    const productIds = new Set<string>();

    items.forEach((item) => {
      if (!item.image || !item.brand || !item.title || !item.price) {
        console.warn(`Mục trong giỏ hàng thiếu dữ liệu:`, item);
        productIds.add(item.productId);
      }
      if (itemMap.has(item.productId)) {
        const existing = itemMap.get(item.productId)!;
        existing.quantity += item.quantity;
      } else {
        itemMap.set(item.productId, {
          ...item,
          image: item.image || '/images/default-product.jpg',
          brand: item.brand || 'Không xác định',
          title: item.title || 'Sản phẩm không xác định',
          price: item.price || 0,
        });
      }
    });

    if (productIds.size > 0) {
      try {
        const res = await fetch(`/api/products?ids=${Array.from(productIds).join(',')}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });
        console.log('HTTP Status from /api/products:', res.status);
        if (!res.ok) {
          console.warn(`Không thể lấy dữ liệu từ /api/products, status: ${res.status}`);
          return Array.from(itemMap.values()); // Bỏ qua nếu API thất bại
        }
        const contentType = res.headers.get('content-type');
        const text = await res.text();
        console.log('Raw response from /api/products:', text);
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Phản hồi từ /api/products không phải JSON:', contentType);
          return Array.from(itemMap.values());
        }
        let data: { products: Product[] };
        try {
          data = JSON.parse(text);
        } catch {
          console.error('Không thể parse JSON từ /api/products:', text);
          return Array.from(itemMap.values());
        }
        console.log('Phản hồi từ /api/products:', data);
        if (data.products) {
          data.products.forEach((product) => {
            const item = itemMap.get(product._id.toString());
            if (item) {
              item.image = product.image || item.image;
              item.brand = product.brand || item.brand;
              item.title = product.title || item.title;
              item.price = parseFloat(product.originalPrice?.replace(/[^0-9.-]+/g, '')) || item.price || 0;
            }
          });
        }
      } catch (error) {
        console.error('Lỗi khi fetch từ /api/products:', error);
      }
    }

    return Array.from(itemMap.values());
  };

  const syncCart = useCallback(async () => {
    console.log('Starting syncCart... User:', user);
    if (!user) {
      console.log('Người dùng chưa đăng nhập, sử dụng localStorage');
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems) as CartItem[];
        const mergedItems = await mergeCartItems(parsedItems);
        console.log('Đồng bộ từ localStorage (sau merge):', mergedItems);
        setCartItems(mergedItems);
      } else {
        console.log('Không có dữ liệu localStorage, đặt lại thành rỗng');
        setCartItems([]);
      }
      return;
    }

    try {
      const res = await fetch('/api/order_products', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('HTTP Status from /api/order_products:', res.status);
      if (res.status === 401 || res.status === 404) {
        console.log(`Không thể lấy giỏ hàng (status ${res.status}), sử dụng localStorage`);
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          console.log('Đồng bộ từ localStorage (sau merge):', mergedItems);
          setCartItems(mergedItems);
        } else {
          setCartItems([]);
        }
        return;
      }
      if (!res.ok) {
        console.warn(`HTTP error! status: ${res.status}`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      const text = await res.text();
      console.log('Raw response from /api/order_products:', text);
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Phản hồi từ /api/order_products không phải JSON:', contentType);
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          console.log('Đồng bộ từ localStorage (sau merge):', mergedItems);
          setCartItems(mergedItems);
        } else {
          setCartItems([]);
        }
        return;
      }
      let data: { products: OrderProduct[] };
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Không thể parse JSON từ /api/order_products:', text);
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          console.log('Đồng bộ từ localStorage (sau merge):', mergedItems);
          setCartItems(mergedItems);
        } else {
          setCartItems([]);
        }
        return;
      }
      console.log('Phản hồi từ /api/order_products:', data);
      if (data && data.products) {
        const mergedItems = await mergeCartItems(data.products.map((p) => ({
          productId: p.id,
          title: p.name,
          price: p.price,
          quantity: p.quantity,
          image: '',
          brand: '',
        })));
        console.log('Đồng bộ từ backend (sau merge):', mergedItems);
        setCartItems(mergedItems);
        localStorage.setItem('cartItems', JSON.stringify(mergedItems));
      } else {
        console.log('Không tìm thấy giỏ hàng hợp lệ từ /api/order_products, thử localStorage');
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          console.log('Đồng bộ từ localStorage (sau merge):', mergedItems);
          setCartItems(mergedItems);
        } else {
          console.log('Không có dữ liệu, đặt lại thành rỗng');
          setCartItems([]);
          localStorage.removeItem('cartItems');
        }
      }
    } catch (error) {
      console.error('Lỗi khi đồng bộ giỏ hàng từ /api/order_products:', error);
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems) as CartItem[];
        const mergedItems = await mergeCartItems(parsedItems);
        console.log('Fallback đến localStorage (sau merge):', mergedItems);
        setCartItems(mergedItems);
      } else {
        console.log('Không có dữ liệu fallback, đặt lại thành rỗng');
        setCartItems([]);
      }
    }
  }, [user]);

  const addToCart = useCallback((item: CartItem) => {
    console.log('Dữ liệu đầu vào addToCart:', item);
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.productId === item.productId);
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [
          ...prev,
          {
            ...item,
            image: item.image || '/images/default-product.jpg',
            brand: item.brand || 'Không xác định',
          },
        ];
      }
      console.log('Giỏ hàng sau khi thêm:', newItems);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      if (user) {
        fetch('/api/order_products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ products: newItems }),
        })
          .then((res) => res.json())
          .then((data) => console.log('Phản hồi từ POST /api/order_products:', data))
          .catch((error) => console.error('Không thể lưu giỏ hàng:', error));
      }
      return newItems;
    });
  }, [user]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) => {
      const newItems = prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      if (user) {
        fetch('/api/order_products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId, quantity }),
        }).catch((error) => console.error('Không thể cập nhật giỏ hàng:', error));
      }
      return newItems;
    });
  }, [user]);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.productId !== productId);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      if (user) {
        fetch(`/api/order_products/${productId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }).catch((error) => console.error('Không thể xóa sản phẩm:', error));
      }
      return newItems;
    });
  }, [user]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const placeOrder = useCallback(async (items: CartItem[], address: string, phone: string, email: string) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để đặt hàng');
    }
    if (!items.length || !address || !phone || !email) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin đặt hàng');
    }

    try {
      const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
      const response = await fetch('/api/order_products/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items,
          address,
          phone,
          email,
          totalPrice,
        }),
      });

      console.log('HTTP Status from /api/order_products/place:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Phản hồi lỗi từ /api/order_products/place:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      const text = await response.text();
      console.log('Raw response from /api/order_products/place:', text);
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Phản hồi từ /api/order_products/place không phải JSON:', contentType);
        throw new Error('Phản hồi không phải JSON');
      }

      let data: { order: { order_code: string } };
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Không thể parse JSON từ /api/order_products/place:', text);
        throw new Error('Response is not valid JSON');
      }

      setCartItems([]);
      localStorage.removeItem('cartItems');

      return { orderCode: data.order.order_code };
    } catch (error) {
      console.error('Không thể đặt hàng:', error);
      throw error;
    }
  }, [user]);

  useEffect(() => {
    syncCart();
  }, [user, syncCart]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, syncCart, clearCart, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};