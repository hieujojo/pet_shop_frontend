"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CartItem } from "@/app/context/CartContext";

interface Order {
  orderCode: string;
  date: string;
  totalPrice: number;
  items: CartItem[];
  address: string;
  phone: string;
  email: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orderHistory");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] to-[#fff5d1] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4a2c2a] text-center mb-8">
          Lịch Sử Đơn Hàng
        </h1>

        {orders.length === 0 ? (
          <div className="text-center">
            <Image
              src="/images/Cart-removebg-preview.png"
              alt="Giỏ hàng trống"
              width={75}
              height={75}
              className="mx-auto mb-8"
            />
            <p className="text-lg text-[#6b4e3d]">
              Bạn chưa có đơn hàng nào. Hãy đặt hàng ngay!
            </p>
            <a
              href="/home"
              className="mt-4 inline-block bg-[#2a9d8f] text-white px-6 py-2 rounded-full hover:bg-[#264653] transition"
            >
              Xem sản phẩm
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {orders.map((order) => (
              <div key={order.orderCode} className="border-b pb-4">
                <h2 className="text-xl font-semibold text-[#4a2c2a] mb-2">
                  Đơn hàng {order.orderCode} - {order.date}
                </h2>
                <p className="text-[#6b4e3d] mb-2">
                  Tổng giá: {order.totalPrice.toLocaleString("vi-VN")}₫
                </p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center">
                      <div className="w-16 h-16 relative mr-4">
                        <Image
                          src={item.image || "/images/default-product.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-md font-semibold text-[#4a2c2a]">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#6b4e3d]">
                          {item.brand || "Không xác định"} - Số lượng:{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-[#e76f51]">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[#6b4e3d]">
                  <p>Địa chỉ: {order.address}</p>
                  <p>Điện thoại: {order.phone}</p>
                  <p>Email: {order.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
