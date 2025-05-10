'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Shuffle, Search, X } from 'lucide-react';
import ProductPreview from '../Products/ProductPreview';
import { useCart, CartItem } from '@/app/context/CartContext';

interface Product {
  _id: string;
  title: string;
  brand: string;
  originalPrice: string;
  discountedPrice?: string;
  image: string;
  hoverImage: string;
  href: string;
  category: string;
  description: string;
  quantity: number;
}

const FoodProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products?category=PS1', {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Không thể lấy sản phẩm');
        }
        const data: Product[] = await response.json();
        console.log('Danh sách sản phẩm từ API /api/products:', data);
        setProducts(data);
        setError(null);
      } catch (error: unknown) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Đã xảy ra lỗi không xác định');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const minColumns = 4;
  const placeholders = Array.from(
    { length: Math.max(0, minColumns - products.length) },
    (_, index) => ({
      _id: `placeholder-${index}`,
      title: 'Sản phẩm sắp ra mắt',
      brand: 'Đang cập nhật',
      originalPrice: '0',
      discountedPrice: undefined,
      image: '/images/default-product.jpg',
      hoverImage: '/images/default-product-hover.jpg',
      href: '#',
      category: '',
      description: '',
      quantity: 0,
    })
  );

  const displayProducts = [...products, ...placeholders];

  const handleViewDetails = (product: Product) => {
    if (!product._id.startsWith('placeholder')) {
      setSelectedProduct(product);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product) => {
    if (product._id.startsWith('placeholder')) return;
    // Xử lý giá: loại bỏ "₫" và "." trước khi parse
    const price = product.discountedPrice
      ? parseFloat(product.discountedPrice.replace('₫', '').replace(/\./g, ''))
      : parseFloat(product.originalPrice.replace('₫', '').replace(/\./g, ''));
    const cartItem: CartItem = {
      productId: product._id, // Chỉ dùng _id
      title: product.title,
      brand: product.brand,
      image: product.image,
      price: isNaN(price) ? 0 : price,
      quantity: 1,
    };
    console.log('Adding to cart:', cartItem);
    addToCart(cartItem);
  };

  if (isLoading) {
    return <div className='text-center'>Đang tải...</div>;
  }

  if (error) {
    return <div className='text-center text-red-500'>Lỗi: {error}</div>;
  }

  return (
    <div className='relative'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10 px-20 text-center lg:text-left'>
        {displayProducts.map((product) => {
          const hasDiscount =
            product.discountedPrice !== undefined &&
            product.discountedPrice !== null &&
            !product._id.startsWith('placeholder');

          return (
            <div key={product._id} className='group overflow-hidden relative'>
              <div className='absolute left-0 bg-[#ffd8d7] text-[#e10600] px-2 py-1 text-xs font-bold inline-block z-10'>
                {product._id.startsWith('placeholder') ? 'Sắp có' : hasDiscount ? 'Giảm giá' : 'Mới'}
              </div>
              <div className='relative w-[320px] h-[320px] overflow-hidden'>
                <Image
                  src={product.image || '/images/default-product.jpg'}
                  alt={product.title || 'Sản phẩm'}
                  width={320}
                  height={320}
                  className='transition-opacity duration-500 group-hover:opacity-0 z-10 object-cover'
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-product.jpg';
                    console.log(`Lỗi tải ảnh cho ${product.title}: ${product.image}`);
                  }}
                />
                <Image
                  src={product.hoverImage || '/images/default-product-hover.jpg'}
                  alt={product.title || 'Sản phẩm'}
                  width={320}
                  height={320}
                  className='absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 z-20 object-cover'
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-product-hover.jpg';
                    console.log(`Lỗi tải hoverImage cho ${product.title}: ${product.hoverImage}`);
                  }}
                />
                <div className='absolute inset-0 bg-opacity-40 hidden group-hover:flex flex-col justify-center items-center gap-3 transition-all duration-300 z-30'>
                  <div className='absolute right-4 top-4 flex flex-col gap-3'>
                    <button
                      onClick={() => handleViewDetails(product)}
                      className='bg-white p-2 rounded-full shadow-lg hover:bg-transparent flex items-center transition-all duration-300'
                    >
                      <Eye size={20} />
                    </button>
                    <button className='bg-white p-2 rounded-full shadow-lg hover:bg-transparent'>
                      <Shuffle size={20} />
                    </button>
                    <button className='bg-white p-2 rounded-full shadow-lg hover:bg-transparent'>
                      <Search size={20} />
                    </button>
                  </div>
                  <button
                    className='bg-white text-black px-4 py-2 rounded-2xl w-[300px] border-2 border-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 absolute bottom-4'
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm Vào Giỏ Hàng
                  </button>
                </div>
              </div>
              <p className='text-[#234BBB] font-bold mt-3'>{product.brand}</p>
              <Link href={`/products/${product._id}`} passHref>
                <h3 className='mt-2 hover:text-[#234BBB] hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-300'>
                  {product.title}
                </h3>
              </Link>
              <div className='flex mt-2'>
                <p
                  className={`font-bold ${
                    hasDiscount ? 'line-through text-black' : 'text-red-500'
                  }`}
                >
                  {product.originalPrice || '0'}
                </p>
                {hasDiscount && (
                  <>
                    <p className='ml-2 text-gray-500 font-bold'> | </p>
                    <p className='ml-2 text-red-500 font-bold'>
                      {product.discountedPrice || '0'}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto'>
          <div className='bg-white rounded-lg max-w-4xl w-full m-4 relative max-h-[90vh] overflow-y-auto'>
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300'
            >
              <X size={24} />
            </button>
            <ProductPreview
              product={{
                ...selectedProduct,
                originalPrice: parseFloat(selectedProduct.originalPrice.replace('₫', '').replace(/\./g, '')) || 0,
                discountedPrice: selectedProduct.discountedPrice
                  ? parseFloat(selectedProduct.discountedPrice.replace('₫', '').replace(/\./g, ''))
                  : undefined,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodProducts;