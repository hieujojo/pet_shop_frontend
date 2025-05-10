import  createMiddleware  from 'next-intl/middleware';

export default createMiddleware({
  locales: ['vi', 'en'], // Các ngôn ngữ hỗ trợ
  defaultLocale: 'vi',   // Ngôn ngữ mặc định
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Áp dụng cho tất cả trừ API và file tĩnh
};