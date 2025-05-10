import { FC } from 'react';
import useForgotPasswordHandler from './ForgotPasswordHandler';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordForm: FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const {
    formData,
    handleChange,
    handleSendCode,
    handleResetPassword,
    step,
    loading,
    error,
    successMessage,
  } = useForgotPasswordHandler();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-[#2156c8] rounded-3xl shadow-lg p-8 max-w-md w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {step === 'sendCode' ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}
        </h2>
        <form
          onSubmit={step === 'sendCode' ? handleSendCode : handleResetPassword}
          className="space-y-6"
        >
          {step === 'sendCode' ? (
            <div>
              <label className="block text-white mb-3 text-lg">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                className="w-full p-3 pl-4 rounded-3xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-white mb-3 text-lg">Mã xác thực</label>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  placeholder="Nhập mã xác thực"
                  className="w-full p-3 pl-4 rounded-3xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-3 text-lg">Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full p-3 pl-4 rounded-3xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-3 text-lg">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full p-3 pl-4 rounded-3xl bg-transparent border border-white text-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
                  required
                />
              </div>
            </>
          )}
          {error && <p className="text-red-500 text-lg text-center">{error}</p>}
          {successMessage && (
            <p className="text-white text-lg text-center">{successMessage}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-[#0088cc] rounded-3xl font-semibold hover:bg-gray-200 text-lg disabled:bg-gray-300 transition duration-200"
          >
            {loading
              ? 'Đang xử lý...'
              : step === 'sendCode'
              ? 'Gửi mã xác thực'
              : 'Đặt lại mật khẩu'}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-transparent border border-white text-white rounded-3xl font-semibold hover:bg-white hover:text-[#0088cc] text-lg transition duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;