"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Minus, Plus } from "lucide-react";
import { useCart, CartItem } from '@/app/context/CartContext';

interface FoodProduct {
  _id: string;
  title: string;
  brand: string;
  originalPrice: number;
  discountedPrice?: number;
  image: string;
  hoverImage: string;
  href: string;
  description: string;
  quantity: number;
  category: string;
}

interface ProductPreviewProps {
  product: FoodProduct;
}

export default function ProductPreview({ product }: ProductPreviewProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const hasDiscount = !!product.discountedPrice;

  const handleAddToCart = () => {
    if (product.quantity < quantity) {
      alert("Số lượng vượt quá tồn kho!");
      return;
    }
    const cartItem: CartItem = {
      productId: product._id,
      title: product.title,
      price: product.discountedPrice || product.originalPrice,
      quantity: quantity,
      image: product.image,
      brand: product.brand,
    };
    addToCart(cartItem);
    console.log(`Thêm vào giỏ hàng: ${product.title}, số lượng: ${quantity}`);
  };

  const handleWishlist = () => {
    console.log(`Thêm vào danh sách yêu thích: ${product.title}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        url: product.href,
      });
    } catch {
      navigator.clipboard.writeText(product.href);
      alert("Đã sao chép URL!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="mb-5">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang Chủ
        </Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Hình ảnh sản phẩm */}
          <div className="relative">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={product.image || "/images/default-product.jpg"}
                alt={product.title}
                fill
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-product.jpg";
                }}
              />
              <Image
                src={product.hoverImage || "/images/default-product-hover.jpg"}
                alt={product.title}
                fill
                className="absolute inset-0 object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-product-hover.jpg";
                }}
              />
            </div>
            <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 text-xs font-bold">
              {hasDiscount ? "Giảm giá" : "Mới"}
            </div>
          </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{product.title}</h1>
          <p className="text-blue-600 font-semibold mt-2">
            Thương hiệu: <Link href={`/brands/${product.brand.toLowerCase()}`}>{product.brand}</Link>
          </p>
          <div className="flex items-center mt-4">
            <p
              className={`text-lg font-bold ${
                hasDiscount ? "line-through text-gray-500" : "text-red-600"
              }`}
            >
              {product.originalPrice.toLocaleString("vi-VN", { minimumFractionDigits: 0 })}₫
            </p>
            <p className="mb-1 ml-2 mr-[-8px]">|</p>
            {hasDiscount && (
              <p className="ml-4 text-lg font-bold text-red-600">
                {product.discountedPrice?.toLocaleString("vi-VN", { minimumFractionDigits: 0 })}₫
              </p>
            )}
          </div>

          {/* Tồn kho */}
          <p className="mt-4 text-sm text-gray-600">
            Tồn kho: {product.quantity > 0 ? product.quantity : "Hết hàng"}
          </p>

          {/* Mô tả */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Mô tả sản phẩm</h3>
            <p className="text-sm text-gray-600 mt-2">{product.description}</p>
          </div>

          {/* Số lượng */}
          {product.quantity > 0 && (
            <div className="mt-6 flex items-center">
              <label className="text-sm font-medium mr-4">Số lượng:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.quantity))
                  }
                  className="w-16 text-center border-none focus:ring-0"
                />
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, product.quantity))}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity >= product.quantity}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Tổng tiền */}
          {product.quantity > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium">Tổng số tiền: </span>
              <span className="text-lg font-bold text-red-600">
                {(
                  quantity * (product.discountedPrice || product.originalPrice)
                ).toLocaleString("vi-VN", { minimumFractionDigits: 0 })}₫
              </span>
            </div>
          )}

          {/* Nút hành động */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-md transition ${
                product.quantity > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={product.quantity === 0}
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleWishlist}
              className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <Heart size={20} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Miễn phí vận chuyển */}
          <div className="mt-6 flex items-start gap-2">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 640 512">
              <path d="M280 192c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240zm352 192h-24V275.9c0-16.8-6.8-33.3-18.8-45.2l-83.9-83.9c-11.8-12-28.3-18.8-45.2-18.8H416V78.6c0-25.7-22.2-46.6-49.4-46.6H113.4C86.2 32 64 52.9 64 78.6V96H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H96V78.6c0-8.1 7.8-14.6 17.4-14.6h253.2c9.6 0 17.4 6.5 17.4 14.6V384H207.6C193 364.7 170 352 144 352c-18.1 0-34.6 6.2-48 16.4V288H64v144c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16h195.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-488 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm272-320h44.1c8.4 0 16.7 3.4 22.6 9.4l83.9 83.9c.8.8 1.1 1.9 1.8 2.8H416V160zm80 320c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-96h-16.4C545 364.7 522 352 496 352s-49 12.7-63.6 32H416v-96h160v96zM256 248v-16c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8z"></path>
            </svg>
            <div>
              <h5 className="text-sm font-semibold">Miễn Phí Vận Chuyển</h5>
              <p className="text-xs text-gray-600">Tối đa 30K cho đơn hàng từ 500K</p>
              <p className="text-xs text-gray-600">Hoả tốc 4h trong nội thành HCM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}