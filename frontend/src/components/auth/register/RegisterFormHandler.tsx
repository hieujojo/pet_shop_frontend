'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const useRegisterFormHandler = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    avatar: 'https://example.com/default-avatar.jpg',
    address: 'Default Address',
    phone: '1234567890',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          avatar: formData.avatar,
          address: formData.address,
          phone: formData.phone,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Đăng ký thất bại.');
      }

      setSuccessMessage('Đăng ký thành công! Vui lòng kiểm tra email.');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.verificationCode,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Xác thực thất bại.');
      }

      login({ name: formData.username, email: formData.email });
      setSuccessMessage('Xác thực email thành công! Chuyển hướng đến trang chính...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleRegister,
    handleVerifyEmail,
    loading,
    error,
    successMessage,
  };
};

export default useRegisterFormHandler;