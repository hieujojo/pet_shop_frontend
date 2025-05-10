'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart, CartItem } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Modal from './Modal';

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, syncCart } = useCart();
  const { user } = useAuth();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
  const router = useRouter();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const selectedTotalPrice = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckboxChange = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === cartItems.length
        ? []
        : cartItems.map((item) => item.productId)
    );
  };

  const handleCheckout = async () => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Thông báo',
        message: 'Vui lòng đăng nhập để đặt hàng.',
        actionButton: {
          label: 'Đăng nhập',
          onClick: () => {
            setModal((prev) => ({ ...prev, isOpen: false }));
            router.push('/auth/login');
          },
        },
      });
      return;
    }

    if (selectedItems.length === 0) {
      setModal({
        isOpen: true,
        title: 'Thông báo',
        message: 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng!',
      });
      return;
    }

    try {
      const itemsToCheckout = cartItems.filter((item) => selectedItems.includes(item.productId));
      localStorage.setItem('selectedCartItems', JSON.stringify(itemsToCheckout));
      router.push('/cart/checkout');
    } catch (error) {
      console.error('Lỗi khi chuyển hướng đến checkout:', error);
      setModal({
        isOpen: true,
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi chuyển đến trang thanh toán. Vui lòng thử lại.',
      });
    }
  };

  const handleImageError = (productId: string, imageUrl: string) => {
    console.error(`Lỗi tải ảnh cho sản phẩm ${productId}: ${imageUrl}`);
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] to-[#fff5d1] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4a2c2a] text-center mb-8">
          Giỏ Hàng Của Bạn
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <Image
              src="/images/Cart-removebg-preview.png"
              alt="Giỏ hàng trống"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <p className="text-lg text-[#6b4e3d] mt-10">
              Giỏ hàng của bạn đang trống! Hãy thêm sản phẩm cho thú cưng nhé.
            </p>
            <a
              href="/home"
              className="mt-4 inline-block bg-[#2a9d8f] text-white px-6 py-2 rounded-full"
            >
              Xem sản phẩm
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={handleSelectAll}
                className="mr-2 h-5 w-5 text-[#2a9d8f] focus:ring-[#2a9d8f] border-gray-300 rounded"
              />
              <span className="text-[#4a2c2a] font-semibold">Chọn tất cả ({cartItems.length})</span>
            </div>

            <div className="space-y-4">
              {cartItems.map((item: CartItem) => {
                if (!item.brand) {
                  console.warn(`Sản phẩm ${item.productId} thiếu brand:`, item);
                }
                const imageUrl = item.image && item.image.startsWith('http') ? item.image : '/images/default-product.jpg';
                return (
                  <div
                    key={item.productId}
                    className="flex items-center border-b pb-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => handleCheckboxChange(item.productId)}
                      className="mr-4 h-5 w-5 text-[#2a9d8f] focus:ring-[#2a9d8f] border-gray-300 rounded"
                    />
                    <div className="w-24 h-24 relative">
                      <Image
                        src={imageErrors[item.productId] ? '/images/default-product.jpg' : imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                        onError={() => handleImageError(item.productId, item.image)}
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h2 className="text-lg font-semibold text-[#4a2c2a]">
                        {item.title}
                      </h2>
                      <p className="text-sm text-[#6b4e3d]">
                        {item.brand || 'Không xác định'}
                      </p>
                      <p className="text-lg font-bold text-[#e76f51]">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </p>
                      <p className="text-sm text-[#6b4e3d]">
                        Đơn giá: {item.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 bg-[#f4a261] text-white rounded-full hover:bg-[#e76f51] disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 bg-[#f4a261] text-white rounded-full hover:bg-[#e76f51]"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-4 text-[#e76f51] hover:text-[#d00000]"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold text-[#4a2c2a] mb-4">
                <span>Tổng cộng ({selectedItems.length} sản phẩm):</span>
                <span>{selectedTotalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="text-center">
                <button
                  onClick={handleCheckout}
                  className="bg-[#2a9d8f] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#264653] transition disabled:opacity-50"
                  disabled={selectedItems.length === 0}
                >
                  Thanh Toán
                </button>
              </div>
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

export default Cart;