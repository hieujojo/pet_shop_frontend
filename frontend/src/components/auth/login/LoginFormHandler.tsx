'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const useLoginFormHandler = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const { login, user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (user && !showSuccessModal) {
      console.log('Chuyển hướng do user tồn tại và modal không hiển thị');
      router.push('/');
    }
  }, [user, checkAuth, router, showSuccessModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      login(data.user);
      console.log('Hiển thị modal thành công');
      setShowSuccessModal(true);
      setTimeout(() => {
        console.log('Đóng modal và chuyển hướng sau 3s');
        setShowSuccessModal(false);
        router.push('/');
      }, 3000); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleLogin, loading, error, showSuccessModal, setShowSuccessModal };
};

export default useLoginFormHandler;