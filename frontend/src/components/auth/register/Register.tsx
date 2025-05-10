'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useRegisterFormHandler from '@/components/auth/register/RegisterFormHandler';

const RegisterForm = () => {
  const {
    formData,
    handleChange,
    handleRegister,
    handleVerifyEmail,
    loading,
    error,
    successMessage,
  } = useRegisterFormHandler();

  const [showVerification, setShowVerification] = useState(false);

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleRegister(e);
    if (success) {
      setShowVerification(true);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <Image
        src="/images/ShibaMeow (4).png"
        alt="Shiba meow"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="absolute top-0 right-32 w-[400px] max-w-sm h-full p-6 flex flex-col justify-center">
        <h2 className="text-white text-2xl font-bold mb-5 text-center">Đăng Ký</h2>

        {!showVerification ? (
          <form onSubmit={handleSubmitRegister}>
            <div className="mb-5">
              <label className="block text-white mb-2 text-base">Tên Tài Khoản</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Tên"
                className="w-full p-3 rounded-2xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-base"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-white mb-2 text-base">Địa Chỉ Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 rounded-2xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-base"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-white mb-2 text-base">Mật Khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full p-3 rounded-2xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-base"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-white mb-2 text-base">Xác Nhận Mật Khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác Nhận Mật khẩu"
                className="w-full p-3 rounded-2xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-base"
                required
              />
            </div>

            {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

            <Link href="/auth/login" passHref>
              <div className="text-center mb-4 text-white text-base cursor-pointer hover:underline">
                Bạn đã có tài khoản?
              </div>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 text-base"
            >
              {loading ? 'Đang xử lý...' : 'Tạo'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail}>
            <h3 className="text-white text-xl font-bold mb-5 text-center">Xác Thực Email</h3>
            <p className="text-white text-sm text-center mb-5">
              Một mã xác thực đã được gửi đến email của bạn. Vui lòng nhập mã bên dưới.
            </p>
            <div className="mb-5">
              <label className="block text-white mb-2 text-base">Mã Xác Thực</label>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="Nhập mã xác thực"
                className="w-full p-3 rounded-2xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-base"
                required
              />
            </div>

            {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4 text-sm">{successMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 text-base"
            >
              {loading ? 'Đang xử lý...' : 'Xác Thực'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;