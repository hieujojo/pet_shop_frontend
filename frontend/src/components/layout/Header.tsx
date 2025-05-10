'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';
import ToggleThemeButton from '@/components/ui/ToggleThemeButton';
import SearchBar from '@/components/ui/SearchBar';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/app/context/CartContext';

interface MenuItem {
  id: number;
  category: string;
  sub_item: string;
  locale: string;
}

export default function Header() {
  const { user, logout } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const locale = useLocale();
  const router = useRouter();
  
  const { cartItems, clearCart, syncCart } = useCart();
  const totalQuantity = cartItems.reduce((total, item: CartItem) => total + item.quantity, 0);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/menu?locale=${locale}`
        );
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      }
    };
    fetchMenuItems();
  }, [locale]);

  const groupedMenuItems = menuItems.reduce(
    (acc: { [key: string]: MenuItem[] }, item: MenuItem) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLogout = async () => {
    await syncCart(); // Đảm bảo đồng bộ lần cuối
    logout();
    clearCart(); // Reset giỏ hàng cục bộ
    setIsAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 dark:bg-blue-800">
      <div className="container mx-auto max-w-[1370px] px-4">
        <div className="flex items-center py-4">
          <div>
            <Link href="/">
              <Image
                src="https://paddy.vn/cdn/shop/files/logo_paddy_desktop_155x@2x.png?v=1693364605"
                alt="Paddy Pet Shop"
                width={180}
                height={51.5}
                className="w-auto"
              />
            </Link>
          </div>

          <div className="hidden lg:block bg-white rounded-md max-w-[680px] flex-1 ml-28">
            <SearchBar />
          </div>

          <div className="ml-16 text-white">
            <div>Hotline</div>
            <div className="font-bold">086 767 7891</div>
          </div>

          <div className="ml-12">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[32px] w-[32px] ml-2 text-white"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <div>
              <div className="text-white mt-1">Wishlist</div>
            </div>
          </div>

          <div className="relative ml-8 group">
            <div
              className="cursor-pointer"
              onMouseEnter={() => setIsAccountOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="h-[32px] w-[32px] ml-7 mb-1.5 text-white"
                viewBox="0 0 1024 1024"
                fill="currentColor"
              >
                <path
                  className="path1"
                  d="M486.4 563.2c-155.275 0-281.6-126.325-281.6-281.6s126.325-281.6 281.6-281.6 281.6 126.325 281.6 281.6-126.325 281.6-281.6 281.6zM486.4 51.2c-127.043 0-230.4 103.357-230.4 230.4s103.357 230.4 230.4 230.4c127.042 0 230.4-103.357 230.4-230.4s-103.358-230.4-230.4-230.4z"
                ></path>
                <path
                  className="path2"
                  d="M896 1024h-819.2c-42.347 0-76.8-34.451-76.8-76.8 0-3.485 0.712-86.285 62.72-168.96 36.094-48.126 85.514-86.36 146.883-113.634 74.957-33.314 168.085-50.206 276.797-50.206 108.71 0 201.838 16.893 276.797 50.206 61.37 27.275 110.789 65.507 146.883 113.634 62.008 82.675 62.72 165.475 62.72 168.96 0 42.349-34.451 76.8-76.8 76.8zM486.4 665.6c-178.52 0-310.267 48.789-381 141.093-53.011 69.174-54.195 139.904-54.2 140.61 0 14.013 11.485 25.498 25.6 25.498h819.2c14.115 0 25.6-11.485 25.6-25.6-0.006-0.603-1.189-71.333-54.198-140.507-70.734-92.304-202.483-141.093-381.002-141.093z"
                ></path>
              </svg>
              {user ? (
                <span className="text-white ml-2">Tài Khoản</span>
              ) : (
                <Link href="/auth/login">
                  <span className="cursor-pointer text-white ml-2">Đăng Nhập</span>
                </Link>
              )}
            </div>

            {user && isAccountOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl z-[1000] border border-gray-200"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <div className="p-4 border-b bg-blue-50 rounded-t-lg">
                  <span className="font-semibold text-lg">Xin Chào, {user?.name || 'Khách'}!</span>
                  <p className="text-sm text-gray-600">{user?.email || 'email@example.com'}</p>
                </div>
                <div className="py-2">
                  <Link
                    href="/auth/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition-colors"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition-colors"
                  >
                    Giỏ Hàng 
                  </Link>
                  <Link
                    href="/cart/order-history"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition-colors"
                  >
                    Lịch sử đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className="ml-8 text-white cursor-pointer relative"
            onClick={handleCartClick}
          >
            <div className="ml-3">
              <svg
                viewBox="0 0 1024 1024"
                className="h-[32px] w-[32px] ml-1 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  className="path1"
                  d="M409.6 1024c-56.464 0-102.4-45.936-102.4-102.4s45.936-102.4 102.4-102.4S512 865.136 512 921.6 466.064 1024 409.6 1024zm0-153.6c-28.232 0-51.2 22.968-51.2 51.2s22.968 51.2 51.2 51.2 51.2-22.968 51.2-51.2-22.968-51.2-51.2-51.2z"
                ></path>
                <path
                  className="path2"
                  d="M768 1024c-56.464 0-102.4-45.936-102.4-102.4S711.536 819.2 768 819.2s102.4 45.936 102.4 102.4S824.464 1024 768 1024zm0-153.6c-28.232 0-51.2 22.968-51.2 51.2s22.968 51.2 51.2 51.2 51.2-22.968 51.2-51.2-22.968-51.2-51.2-51.2z"
                ></path>
                <path
                  className="path3"
                  d="M898.021 228.688C885.162 213.507 865.763 204.8 844.8 204.8H217.954l-5.085-30.506C206.149 133.979 168.871 102.4 128 102.4H76.8c-14.138 0-25.6 11.462-25.6 25.6s11.462 25.6 25.6 25.6H128c15.722 0 31.781 13.603 34.366 29.112l85.566 513.395C254.65 736.421 291.929 768 332.799 768h512c14.139 0 25.6-11.461 25.6-25.6s-11.461-25.6-25.6-25.6h-512c-15.722 0-31.781-13.603-34.366-29.11l-12.63-75.784 510.206-44.366c39.69-3.451 75.907-36.938 82.458-76.234l34.366-206.194c3.448-20.677-1.952-41.243-14.813-56.424zm-35.69 48.006l-34.366 206.194c-2.699 16.186-20.043 32.221-36.39 33.645l-514.214 44.714-50.874-305.246h618.314c5.968 0 10.995 2.054 14.155 5.782 3.157 3.729 4.357 9.024 3.376 14.911z"
                ></path>
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-300 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </div>
            <div>
              <div className="text-white mt-1">Giỏ Hàng</div>
            </div>
          </div>
        </div>

        <div>
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-8 py-2">
              {Object.keys(groupedMenuItems).map((category) => (
                <div key={category} className="relative group">
                  <button className="text-white text-[18px] font-bold group-hover:after:content-[''] group-hover:after:absolute group-hover:after:w-full group-hover:after:h-[2px] group-hover:after:bg-white group-hover:after:bottom-0 group-hover:after:left-0 transition-all">
                    {category}
                  </button>
                  <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 py-2 w-48 z-[1000]">
                    {groupedMenuItems[category].map((item: MenuItem) => (
                      <Link
                        key={item.id}
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {item.sub_item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="ml-auto">
                <ToggleThemeButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}