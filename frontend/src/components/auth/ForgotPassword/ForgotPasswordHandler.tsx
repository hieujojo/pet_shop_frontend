'use client';

import { useState } from 'react';

interface FormData {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

const useForgotPasswordHandler = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [step, setStep] = useState<'sendCode' | 'resetPassword'>('sendCode');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gửi mã xác thực thất bại.');
      }

      setSuccessMessage('Mã xác thực đã được gửi! Vui lòng kiểm tra email.');
      setStep('resetPassword');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.verificationCode,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đặt lại mật khẩu thất bại.');
      }

      setSuccessMessage('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.');
      setTimeout(() => {
        setSuccessMessage('');
        setFormData({
          email: '',
          verificationCode: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setStep('sendCode');
      }, 3000); // Reset form sau 3 giây
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSendCode,
    handleResetPassword,
    step,
    loading,
    error,
    successMessage,
  };
};

export default useForgotPasswordHandler;