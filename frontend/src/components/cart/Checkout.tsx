'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Modal from '../cart/Modal';

interface Order {
  orderCode: string;
  date: string;
  totalPrice: number;
  items: CartItem[];
  address: string;
  phone: string;
  email: string;
}

const Checkout = () => {
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionButton?: { label: string; onClick: () => void };
  }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const { user } = useAuth();
  const { placeOrder } = useCart();
  const router = useRouter();

  useEffect(() => {
    const items = localStorage.getItem('selectedCartItems');
    if (items) {
      setSelectedItems(JSON.parse(items));
    } else {
      router.push('/cart');
    }

    // Tự động điền thông tin người dùng nếu có
    if (user) {
      setEmail(user.email || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user, router]);

  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone || !email) {
      setError('Vui lòng nhập đầy đủ địa chỉ, số điện thoại và email.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { orderCode } = await placeOrder(selectedItems, address, phone, email);
      localStorage.removeItem('selectedCartItems'); // Xóa sau khi đặt hàng thành công

      // Lưu đơn hàng vào lịch sử
      const newOrder: Order = {
        orderCode,
        date: new Date().toLocaleString('vi-VN'),
        totalPrice,
        items: selectedItems,
        address,
        phone,
        email,
      };
      const storedOrders = localStorage.getItem('orderHistory');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.push(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orders));

      setModal({
        isOpen: true,
        title: 'Đặt hàng thành công',
        message: `Mã đơn hàng: ${orderCode}. Thông tin đã được gửi qua email ${email}.`,
        actionButton: {
          label: 'Về trang chủ',
          onClick: () => {
            setModal((prev) => ({ ...prev, isOpen: false }));
            router.push('/home');
          },
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Đã xảy ra lỗi không xác định');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] to-[#fff5d1] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4a2c2a] text-center mb-8">
          Xác Nhận Đặt Hàng
        </h1>

        {selectedItems.length === 0 ? (
          <div className="text-center">
            <Image
              src="/images/empty-cart.png"
              alt="Không có sản phẩm"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <p className="text-lg text-[#6b4e3d]">
              Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng.
            </p>
            <a
              href="/cart"
              className="mt-4 inline-block bg-[#2a9d8f] text-white px-6 py-2 rounded-full hover:bg-[#264653] transition"
            >
              Quay lại giỏ hàng
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[#4a2c2a] mb-4">
              Sản phẩm đặt hàng ({selectedItems.length})
            </h2>
            <div className="space-y-4 mb-6">
              {selectedItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center border-b pb-4"
                >
                  <div className="w-24 h-24 relative">
                    <Image
                      src={imageErrors[item.productId] ? '/images/default-product.jpg' : item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                      onError={() => handleImageError(item.productId)}
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-[#4a2c2a]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6b4e3d]">{item.brand}</p>
                    <p className="text-sm text-[#6b4e3d]">
                      Đơn giá: {item.price.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-sm text-[#6b4e3d]">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-lg font-bold text-[#e76f51]">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <h2 className="text-xl font-semibold text-[#4a2c2a] mb-4">
                Thông tin giao hàng
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#4a2c2a] font-semibold mb-1">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                    placeholder="Nhập địa chỉ giao hàng"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#4a2c2a] font-semibold mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#4a2c2a] font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                    placeholder="Nhập email để nhận xác nhận"
                    required
                  />
                </div>
                {error && (
                  <div className="text-center text-red-500">{error}</div>
                )}
                <div className="flex justify-between text-lg font-semibold text-[#4a2c2a] mb-4">
                  <span>Tổng cộng:</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#2a9d8f] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#264653] transition disabled:opacity-50"
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đặt Hàng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        actionButton={modal.actionButton}
      />
    </div>
  );
};

export default Checkout;