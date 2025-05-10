'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { useCart, CartItem } from '@/app/context/CartContext';

interface Variant {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number;
  available: boolean;
  featuredImage?: string;
  discountedPrice?: number; 
}

interface Product {
  id?: string;
  _id?: string;
  title: string;
  brand: string;
  originalPrice: number;
  discountedPrice?: number;
  image: string;
  hoverImage: string;
  images?: string[];
  variants?: Variant[];
  description?: string;
  rating?: number;
  reviews?: number;
}

interface Review {
  _id: string;
  productId: string;
  email: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  productTitle?: string;
}

interface ProductDetailProps {
  product: { id: string };
}

const ProductDetail = ({ product: propProduct }: ProductDetailProps) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewModalMessage, setReviewModalMessage] = useState('');

  // Lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${propProduct.id}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Không thể lấy sản phẩm');
        }
        const data: Product = await response.json();
        setProduct(data);
        setSelectedVariant(
          data.variants?.[0] || {
            id: data._id || propProduct.id,
            title: '400g',
            price: data.discountedPrice || data.originalPrice || 0,
            compareAtPrice: data.originalPrice || 0,
            available: true,
          }
        );
        setCurrentImage(data.image);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [propProduct.id]);

  // Lấy danh sách đánh giá
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews', {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Không thể lấy đánh giá');
        }
        const data: Review[] = await response.json();
        const filteredReviews = data.filter((review) => review.productId === propProduct.id);
        setReviews(filteredReviews);
      } catch (err) {
        console.error('Lỗi lấy đánh giá:', err);
      }
    };
    fetchReviews();
  }, [propProduct.id]);

  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error || !product) {
    return <div className="text-center text-red-500">Lỗi: {error || 'Không tìm thấy sản phẩm'}</div>;
  }

  const imagesArray = Array.isArray(product.images)
    ? product.images.filter((img) => img.trim() !== '')
    : [product.image, product.hoverImage].filter((img) => img.trim() !== '');

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
    if (variant.featuredImage) {
      setCurrentImage(variant.featuredImage);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setReviewModalMessage('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      setShowReviewModal(true);
      return;
    }
    if (selectedVariant) {
      const cartItem: CartItem = {
        productId: selectedVariant.id,
        title: product.title,
        price: selectedVariant.price,
        quantity,
        image: currentImage || product.image,
        brand: product.brand,
      };
      addToCart(cartItem);
      setShowCartModal(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      setReviewModalMessage('Vui lòng đăng nhập để gửi đánh giá!');
      setShowReviewModal(true);
      return;
    }
    if (!commentContent.trim()) {
      setReviewModalMessage('Vui lòng nhập nội dung đánh giá!');
      setShowReviewModal(true);
      return;
    }

    const newReview = {
      productId: propProduct.id,
      email: user.email || 'guest@example.com',
      username: user.name || 'Khách',
      rating: commentRating,
      comment: commentContent,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Không thể gửi đánh giá');
      }

      const savedReview: Review = await response.json();
      setReviews((prev) => [savedReview, ...prev]);
      setCommentContent('');
      setCommentRating(5);
      setReviewModalMessage('Đánh giá đã được gửi thành công!');
      setShowReviewModal(true);
    } catch (err) {
      console.error('Lỗi gửi đánh giá:', err);
      setReviewModalMessage('Không thể gửi đánh giá, vui lòng thử lại!');
      setShowReviewModal(true);
    }
  };

  const variants = [
    { id: '1', title: '400g', price: 115500, compareAtPrice: 124000, available: true },
    { id: '2', title: '2kg', price: 500000, compareAtPrice: 550000, available: true },
    { id: '3', title: '4kg', price: 900000, compareAtPrice: 950000, available: true },
    { id: '4', title: '10kg', price: 2000000, compareAtPrice: 2100000, available: true },
    { id: '5', title: 'Túi Chia 1kg', price: 220000, compareAtPrice: 240000, available: false },
  ];

  const description = {
    overview: `
      <ul class="list-disc pl-5">
        <li><strong>Thương hiệu:</strong> Royal Canin</li>
        <li><strong>Phù hợp cho:</strong> Mèo nhà trưởng thành (trên 12 tháng tuổi)</li>
        <li><strong>Thức ăn cho mèo Royal Canin Indoor sẽ là sự lựa chọn phù hợp với bạn. Được thiết kế với mục đích calo vừa phải, hạt Royal Canin giúp mèo hạn chế tăng trọng lượng. Các sợi psyllium và các chất đạm dễ tiêu hóa có trong thức ăn cũng giúp loại bỏ bị lông trong bụng và giảm thiểu mùi hôi khi mèo đi vệ sinh học tập. Thức ăn Royal Canin với dạng hạt khô độc đáo còn giúp mèo giảm sự tích tụ cao răng và mang lại hàm răng khỏe mạnh.</li>
      </ul>
    `,
    benefits: `
      <h3 class="font-bold text-lg mt-4">Lợi ích:</h3>
      <ul class="list-disc pl-5">
        <li><strong>Giảm mùi hôi chất thải:</strong> Các protein làm tăng khả năng tiêu hóa, chất dinh dưỡng, động thực hỗ trợ duy trì sức khỏe hệ tiêu hóa, giảm lượng phân (và mùi hôi của phân) ở mèo trưởng thành.</li>
        <li><strong>Quản lý cân nặng:</strong> Chế độ ăn kiểm với mức calo vừa phải, thích ứng với cường độ hoạt động thấp của mèo nhà, giúp giữ cân nặng ở mức lý tưởng.</li>
        <li><strong>Điều chỉnh bị lông:</strong> Giúp kích thích chuyển động của đường ruột, loại bỏ các sợi lông bị nuốt thông qua sự kết hợp của các chất xơ lên men và không lên men.</li>
      </ul>
    `,
    ingredients: `
      <h3 class="font-bold text-lg mt-4">Thành phần:</h3>
      <p>Bột gà, ngô, gạo nâu bia, gluten ngô, lúa mì, gluten lúa mì, hương vị tự nhiên, gạo lứt, chất xơ đậu, trà, bột củ cải khô, thực vật, canxi sunfat, men khô chưng cất nguồn cung cấp natri silico aluminate, đậu cà, chiết xuất hương thảo, dầu...</p>
    `,
  };

  const usageGuide = [
    { weight: '6.6 lb (3 kg)', lowActivity: '3/8 Cốc (36 g)', normalActivity: '1/2 Cốc (45 g)', highActivity: '5/8 Cốc (54 g)' },
    { weight: '8.8 lb (4 kg)', lowActivity: '1/2 Cốc (45 g)', normalActivity: '5/8 Cốc (56 g)', highActivity: '3/4 Cốc (67 g)' },
    { weight: '11 lb (5 kg)', lowActivity: '5/8 Cốc (52 g)', normalActivity: '3/4 Cốc (65 g)', highActivity: '7/8 Cốc (78 g)' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">Trang Chủ</Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
            <Image
              src={currentImage || '/images/default-product.jpg'}
              alt={product.title}
              fill
              className="object-contain"
            />
            {selectedVariant && selectedVariant.price < selectedVariant.compareAtPrice && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Giảm Giá
              </span>
            )}
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {imagesArray.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(image)}
                className={`w-16 h-16 relative rounded border ${currentImage === image ? 'border-blue-600' : 'border-gray-200'}`}
              >
                <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.098 10.1c-.784-.57-.382-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z" />
                </svg>
              ))}
            </div>
            <span>({reviews.length} đánh giá)</span>
          </div>

          <p>
            <strong>Thương hiệu:</strong>{' '}
            <Link href={`/collections/vendors?q=${product.brand}`} className="text-blue-600">
              {product.brand}
            </Link>
          </p>

          <div className="text-2xl">
            <span className="text-red-600 font-bold">
              {selectedVariant?.price.toLocaleString('vi-VN') || '0'}
            </span>
            <span className="ml-2">|</span>
            {selectedVariant && selectedVariant.price < selectedVariant.compareAtPrice && (
              <span className="line-through text-gray-500 ml-2">
                {selectedVariant.compareAtPrice.toLocaleString('vi-VN')}
              </span>
            )}
          </div>

          <div>
            <label className="block font-semibold">Size:</label>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant)}
                  disabled={!variant.available}
                  className={`px-4 py-2 border rounded text-sm ${
                    selectedVariant?.id === variant.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-blue-50'
                  } ${!variant.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-semibold">Số lượng:</div>
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2"
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center border-none"
                min="1"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2">
                +
              </button>
            </div>
          </div>

          <p>
            <strong>Tổng số tiền:</strong>{' '}
            <span className="text-red-600 font-bold">
              {product && selectedVariant
                ? (
                    (selectedVariant.price || product.originalPrice || 0) * quantity
                  ).toLocaleString('vi-VN')
                : '0'}₫
            </span>
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.available}
            className={`w-full py-3 bg-blue-600 text-white rounded text-lg ${
              !selectedVariant?.available ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Thêm Vào Giỏ Hàng
          </button>

          <div className="flex items-start space-x-2 bg-gray-100 p-4 rounded">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm">
                Miễn phí vận chuyển tối đa 30K cho đơn hàng từ 500K
              </p>
              <p className="text-sm">Hỏa tốc 4h trong nội thành HCM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận thêm vào giỏ hàng */}
      <AnimatePresence>
        {showCartModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCartModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">Đã thêm vào giỏ hàng!</h2>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={currentImage || product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold">{product.title}</p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {quantity} | Giá: {selectedVariant?.price.toLocaleString('vi-VN')}₫
                  </p>
                  <p className="text-sm text-gray-600">Thương hiệu: {product.brand}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCartModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Tiếp tục mua sắm
                </button>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    router.push('/cart');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Xem giỏ hàng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal thông báo đánh giá */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
              </div>
              <p className="text-gray-700 mb-6">{reviewModalMessage}</p>
              <div className="flex justify-end space-x-4">
                {reviewModalMessage.includes('đăng nhập') && (
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      router.push('/auth/login');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Đăng nhập
                  </button>
                )}
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <h2 className="text-xl font-bold border-b-2 border-black inline-block pb-1">
          Mô Tả
        </h2>
        <div className="mt-4">
          <div dangerouslySetInnerHTML={{ __html: description.overview }} />
          <AnimatePresence>
            {showFullDescription && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div dangerouslySetInnerHTML={{ __html: description.benefits }} />
                <div dangerouslySetInnerHTML={{ __html: description.ingredients }} />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-4 px-6 py-2 border border-gray-300 rounded-full text-blue-600 hover:bg-gray-100 transition-colors"
          >
            {showFullDescription ? 'Thu gọn' : 'Đọc thêm'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Hướng dẫn sử dụng</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">Cân nặng mèo</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Hoạt động thấp</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Hoạt động trung bình</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Hoạt động cao</th>
              </tr>
            </thead>
            <tbody>
              {usageGuide.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{row.weight}</td>
                  <td className="border border-gray-200 px-4 py-2">{row.lowActivity}</td>
                  <td className="border border-gray-200 px-4 py-2">{row.normalActivity}</td>
                  <td className="border border-gray-200 px-4 py-2">{row.highActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold border-b-2 border-black inline-block pb-1">
          Viết đánh giá
        </h2>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!user && (
            <p className="text-red-500 mb-4">
              Vui lòng <Link href="/auth/login" className="text-blue-600 underline">đăng nhập</Link> để viết đánh giá.
            </p>
          )}
          <div className="flex items-center mb-4">
            <label className="font-semibold mr-4">Đánh giá:</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setCommentRating(star)}
                  className={`w-8 h-8 transition-colors duration-200 ${
                    star <= commentRating ? 'text-yellow-400' : 'text-gray-300'
                  } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!user}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.098 10.1c-.784-.57-.382-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Viết đánh giá của bạn..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50 text-gray-700"
            rows={5}
            disabled={!user}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!user || !commentContent.trim()}
          >
            Gửi đánh giá
          </button>
        </motion.div>
      </div>

      <div id="reviews" className="mt-8">
        <h2 className="text-xl font-bold border-b-2 border-black inline-block pb-1">
          Phản hồi từ khách hàng
        </h2>
        <div className="mt-4 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold text-xl mr-4">
                    {review.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.username}</p>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3 .921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784 .57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.098 10.1c-.784-.57-.382-1.81 .588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;