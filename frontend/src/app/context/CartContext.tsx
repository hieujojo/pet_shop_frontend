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

// Định nghĩa kiểu dữ liệu cho Order
interface Order {
  orderCode: string;
  date: string;
  totalPrice: number;
  items: CartItem[];
  address: string;
  phone: string;
  email: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  syncCart: () => Promise<void>;
  clearCart: () => void;
  placeOrder: (items: CartItem[], address: string, phone: string, email: string) => Promise<{ orderCode: string }>;
  getOrderHistory: () => Promise<Order[]>;
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
        if (!res.ok) {
          console.warn(`Không thể lấy dữ liệu từ /api/products, status: ${res.status}`);
          return Array.from(itemMap.values());
        }
        const contentType = res.headers.get('content-type');
        const text = await res.text();
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
    if (!user || !user.email) {
      const storedItems = localStorage.getItem(`cartItems_guest`);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems) as CartItem[];
        const mergedItems = await mergeCartItems(parsedItems);
        setCartItems(mergedItems);
      } else {
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
      if (res.status === 401 || res.status === 404) {
        const storedItems = localStorage.getItem(`cartItems_${user.email}`);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          setCartItems(mergedItems);
        } else {
          setCartItems([]);
        }
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      const text = await res.text();
      if (!contentType || !contentType.includes('application/json')) {
        const storedItems = localStorage.getItem(`cartItems_${user.email}`);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
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
        const storedItems = localStorage.getItem(`cartItems_${user.email}`);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          setCartItems(mergedItems);
        } else {
          setCartItems([]);
        }
        return;
      }
      if (data && data.products) {
        const mergedItems = await mergeCartItems(data.products.map((p) => ({
          productId: p.id,
          title: p.name,
          price: p.price,
          quantity: p.quantity,
          image: '',
          brand: '',
        })));
        setCartItems(mergedItems);
        localStorage.setItem(`cartItems_${user.email}`, JSON.stringify(mergedItems));
      } else {
        const storedItems = localStorage.getItem(`cartItems_${user.email}`);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems) as CartItem[];
          const mergedItems = await mergeCartItems(parsedItems);
          setCartItems(mergedItems);
        } else {
          setCartItems([]);
          localStorage.removeItem(`cartItems_${user.email}`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi đồng bộ giỏ hàng từ /api/order_products:', error);
      const storedItems = localStorage.getItem(`cartItems_${user.email}`);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems) as CartItem[];
        const mergedItems = await mergeCartItems(parsedItems);
        setCartItems(mergedItems);
      } else {
        setCartItems([]);
      }
    }
  }, [user]);

  const addToCart = useCallback((item: CartItem) => {
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
      localStorage.setItem(`cartItems_${user?.email ?? 'guest'}`, JSON.stringify(newItems));
      if (user && user.email) {
        fetch('/api/order_products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ products: newItems }),
        })
          .then((res) => res.json())
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
      localStorage.setItem(`cartItems_${user?.email ?? 'guest'}`, JSON.stringify(newItems));
      if (user && user.email) {
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
      localStorage.setItem(`cartItems_${user?.email ?? 'guest'}`, JSON.stringify(newItems));
      if (user && user.email) {
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
    localStorage.removeItem(`cartItems_${user?.email ?? 'guest'}`);
  }, [user]);

  const placeOrder = useCallback(async (items: CartItem[], address: string, phone: string, email: string) => {
    if (!user || !user.email) {
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
          userId: user.email,
          items,
          address,
          phone,
          email,
          totalPrice,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      const text = await response.text();
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Phản hồi không phải JSON');
      }

      let data: { order: { order_code: string } };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Response is not valid JSON');
      }

      setCartItems([]);
      localStorage.removeItem(`cartItems_${user.email}`);

      return { orderCode: data.order.order_code };
    } catch (error) {
      console.error('Không thể đặt hàng:', error);
      throw error;
    }
  }, [user]);

  const getOrderHistory = useCallback(async (): Promise<Order[]> => {
    if (!user || !user.email) {
      return [];
    }

    try {
      const response = await fetch('http://localhost:5000/api/order_products/history', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      const text = await response.text();
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Phản hồi không phải JSON');
      }

      let data: { orders: Array<{
        order_code: string;
        total: number;
        status: number;
        created_at: string;
        updated_at: string;
        user: { id: string; name: string; address: string; phone: string };
        products: Array<{
          productId: string;
          title: string;
          brand: string;
          image: string;
          price: number;
          quantity: number;
        }>;
      }> };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Response is not valid JSON');
      }

      // Gộp các đơn hàng có cùng order_code
      const orderMap = new Map<string, Order>();
      data.orders.forEach((order) => {
        const existingOrder = orderMap.get(order.order_code);
        if (existingOrder) {
          // Gộp sản phẩm vào đơn hàng hiện có
          existingOrder.items.push(...order.products.map((product) => ({
            productId: product.productId,
            title: product.title,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            brand: product.brand,
          })));
          existingOrder.totalPrice += order.total;
        } else {
          // Tạo đơn hàng mới
          orderMap.set(order.order_code, {
            orderCode: order.order_code,
            date: order.created_at,
            totalPrice: order.total,
            items: order.products.map((product) => ({
              productId: product.productId,
              title: product.title,
              price: product.price,
              quantity: product.quantity,
              image: product.image,
              brand: product.brand,
            })),
            address: order.user.address,
            phone: order.user.phone,
            email: order.user.id,
          });
        }
      });

      return Array.from(orderMap.values());
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
      return [];
    }
  }, [user]);

  useEffect(() => {
    syncCart();
  }, [user, syncCart]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, syncCart, clearCart, placeOrder, getOrderHistory }}>
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