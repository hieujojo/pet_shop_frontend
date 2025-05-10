"use client";

import { usePathname, useRouter } from "next/navigation";

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const locale = typeof window !== "undefined" ? localStorage.getItem("locale") || "vi" : "vi";

  const changeLanguage = (lang: string) => {
    if (lang !== locale) {
      localStorage.setItem("locale", lang);
      router.push(`/${lang}${pathname}`); // Điều hướng đến trang mới theo ngôn ngữ
    }
  };

  return { locale, changeLanguage };
}
