import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Thành viên Paddiers</h2>
          <p className="text-gray-700 mb-6 w-[660px] mx-auto">
            Đăng ký thành viên ngay hôm nay để nhận email về sản phẩm mới và
            chương trình khuyến mãi của Paddy
          </p>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="p-5 border border-gray-300 rounded-md focus:outline-none w-[500px] h-[56px]"
            />
            <button
              type="submit"
              className="bg-[#234BBB] font-bold w-36 text-white px-4 py-2 rounded-3xl ml-4 hover:bg-black"
            >
              Đăng ký
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
          <div className="ml-10">
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/collections/thuc-an-cho-cho"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dành Cho Chó
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/mua-sam-cho-meo"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dành Cho Mèo
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/brands-thuong-hieu-thu-cung"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Thương Hiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs/cham-soc-thu-cung"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/brands-thuong-hieu-thu-cung"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Bộ Sưu Tập
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Paddy Pet Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/paddy-pet-shop"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/uu-dai-tich-luy-thanh-vien-paddier"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Thành Viên Paddier
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms-of-service"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/tuyen-dung"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Tuyển Dụng
                </Link>
              </li>
            </ul>
          </div>

          <div className="mr-10">
            <h3 className="text-lg font-bold mb-4">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/chinh-sach-doi-tra-hang"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Chính Sách Đổi Trả Hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping-policy"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Phương Thức Vận Chuyển
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy-policy"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/huong-dan-thanh-toan"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Phương Thức Thanh Toán
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/refund-policy"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Chính Sách Hoàn Tiền
                </Link>
              </li>
            </ul>
          </div>

          <div className="mr-10">
            <h3 className="text-lg font-bold mb-4">Liên Hệ</h3>
            <div className="text-gray-700">
              <p>
                CÔNG TY CỔ PHẦN THƯƠNG MẠI & DỊCH VỤ PADDY
                <br />
                MST: 0316459054
                <br />
                116 Nguyễn Văn Thủ, Phường Đa Kao, Quận 1, Thành phố Hồ Chí
                Minh, Việt Nam
              </p>
              <p className="mt-4">
                <span className="font-bold">Hotline:</span>{" "}
                <Link href="tel:0867677891" className="text-blue-600">
                  0867677891
                </Link>
              </p>
              <p className="mt-2">
                <span className="font-bold">Email:</span>{" "}
                <Link href="mailto:contact@paddy.vn" className="text-blue-600">
                  contact@paddy.vn
                </Link>
              </p>
            </div>
            <div className="mt-6 flex space-x-2 ">
              <Link
                href="https://www.facebook.com/PaddyPetShop"
                className="text-gray-700 hover:text-blue-600 border border-transparent rounded-full p-2 hover:border-blue-600 transition-all duration-300"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953h-1.508c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/paddypetshop/"
                className="text-gray-700 hover:text-blue-600 border border-transparent rounded-full p-2 hover:border-blue-600 transition-all duration-300"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link
                href="https://www.tiktok.com/@paddypetshop"
                className="text-gray-700 hover:text-blue-600 border border-transparent rounded-full p-2 hover:border-blue-600 transition-all duration-300"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 flex justify-between items-center">
        <div className="mt-6 ml-20 px-4">
          <p className="text-gray-400">@2024 Paddy VN. All Rights Reserved.</p>
        </div>
        <div>
          <Image
            src="https://cdn.shopify.com/s/files/1/0624/1746/9697/files/9999.png?v=1665417559"
            alt="Paddy Pet Shop"
            width={200}
            height={51.5}
            className="mr-20 mt-6"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
