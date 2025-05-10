'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useLoginFormHandler from '@/components/auth/login/LoginFormHandler';
import SuccessModal from '@/components/auth/login/SuccessModal';
import ForgotPasswordForm from '@/components/auth/ForgotPassword/ForgotPasswordForm';

const LoginForm = () => {
  const {
    formData,
    handleChange,
    handleLogin,
    loading,
    error,
    showSuccessModal,
    setShowSuccessModal,
  } = useLoginFormHandler();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="flex items-center h-screen bg-[#2156c8]">
      <div className="bg-[#2156c8] w-[600px] h-screen">
        <Image
          src="/images/DogShiba.png"
          alt="Shiba Inu"
          width={608}
          height={100}
          quality={100}
          className="h-screen"
        />
      </div>
      <div className="w-[450px] ml-56 p-8 bg-[#2156c8]">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-white mb-3 text-lg">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 pl-4 rounded-3xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-3 text-lg">Mật Khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật Khẩu"
              className="w-full p-3 pl-4 rounded-3xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-[#0088cc] rounded-3xl font-semibold hover:bg-gray-200 text-lg"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
          {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
          <div
            className="text-center text-white mt-5 cursor-pointer hover:underline text-lg"
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </div>
          <Link href="/auth/register" passHref>
            <button className="w-full py-3 mt-5 bg-green-500 text-white rounded-3xl font-semibold hover:bg-green-600 text-lg">
              Tạo Tài Khoản
            </button>
          </Link>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <ForgotPasswordForm
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default LoginForm;