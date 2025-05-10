'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import ForgotPasswordForm from '@/components/auth/ForgotPassword/ForgotPasswordForm';
import useForgotPasswordHandler from '../ForgotPassword/ForgotPasswordHandler';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật thất bại.');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  useForgotPasswordHandler();

  if (!user) {
    return <div className="text-[#6b4e3d] text-center mt-10 text-lg">Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] to-[#fff5d1] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4a2c2a] text-center mb-8">
          Hồ Sơ Của Bạn
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-[#4a2c2a] font-semibold mb-2 text-lg">Tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-[#4a2c2a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] text-lg"
              />
            </div>
            <div>
              <label className="block text-[#4a2c2a] font-semibold mb-2 text-lg">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-[#4a2c2a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] text-lg bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-[#4a2c2a] font-semibold mb-2 text-lg">Địa Chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-[#4a2c2a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] text-lg"
              />
            </div>
            <div>
              <label className="block text-[#4a2c2a] font-semibold mb-2 text-lg">Số Điện Thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-[#4a2c2a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] text-lg"
              />
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2a9d8f] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#264653] transition disabled:opacity-50"
                >
                  {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
                </button>
              </div>
              {error && <p className="text-[#e76f51] text-lg text-center mt-4">{error}</p>}
              <div
                className="text-center text-[#4a2c2a] mt-5 cursor-pointer hover:underline text-lg"
                onClick={() => setShowForgotPassword(true)}
              >
                Quên mật khẩu?
              </div>
            </div>
          </form>
        </div>

        <ForgotPasswordForm
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );
};

export default Profile;