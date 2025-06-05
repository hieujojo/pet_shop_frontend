"use client";

import { useState, useEffect, useCallback, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Giao diện Product đồng bộ với ProductDetail.tsx
interface Product {
  id: string;
  title: string;
  brand: string;
  originalPrice: string; // Hoặc number, tùy thuộc vào API
  discountedPrice?: string; // Hoặc number
  image: string;
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Hàm chuẩn hóa chuỗi tiếng Việt
  const normalizeVietnamese = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();
  };

  // Fetch sản phẩm tìm kiếm
  const fetchSearchResults = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }
    setIsSearchLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/search?search=${encodeURIComponent(term)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Không thể tìm kiếm sản phẩm");
      const data: Product[] = await res.json();
      // Kiểm tra dữ liệu trả về
      setSearchResults(
        data.filter((product) => product.id && typeof product.id === "string")
      );
      setError(null);
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Fetch sản phẩm nổi bật
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Không thể tải sản phẩm nổi bật");
        const data: Product[] = await res.json();
        const royalCaninProducts = data
          .filter(
            (product) =>
              product.brand && normalizeVietnamese(product.brand) === "royal canin"
          )
          .slice(0, 3);
        setFeaturedProducts(royalCaninProducts);
        setError(null);
      } catch (err) {
        setError("Lỗi khi tải sản phẩm: " + (err as Error).message);
      } finally {
        setIsFeaturedLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Debounce tìm kiếm
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSearchResults(searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, fetchSearchResults]);

  // Chuẩn hóa đường dẫn hình ảnh
  const normalizeImagePath = (path: string | undefined): string => {
    if (!path) return "/images/default-product.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path;
    return `/images/${path}`;
  };

  // Highlight từ khóa tìm kiếm
  const highlightSearchTerm = (text: string, term: string): JSX.Element => {
    if (!term) return <span>{text}</span>;
    const normalizedTerm = normalizeVietnamese(term);
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          normalizeVietnamese(part) === normalizedTerm ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Xử lý nhấp vào sản phẩm
  const handleProductClick = () => {
    setSearchTerm(""); // Xóa nội dung tìm kiếm
    setIsFocused(false); // Ẩn danh sách kết quả
  };

  const popularSearches = [
    "royal canin",
    "Gel Dinh Dưỡng",
    "Thức Ăn Hạt",
    "Pate Mèo",
  ];

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="search"
          className="w-full h-[50px]"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay để cho phép nhấp vào kết quả trước khi ẩn
            setTimeout(() => setIsFocused(false), 200);
          }}
        />
        <Button className="absolute bg-white right-2 top-1/2 -translate-y-1/2 shadow-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-5 h-5"
          >
            <path d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5   S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9   C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z" />
          </svg>
        </Button>
      </div>
      {(isFocused || searchTerm) && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-2 z-50 max-h-[500px] overflow-y-auto">
          {searchTerm ? (
            isSearchLoading ? (
              <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Lỗi: {error}</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center p-4 hover:bg-gray-100"
                  onClick={handleProductClick}
                >
                  <Image
                    src={normalizeImagePath(product.image)}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-product.jpg";
                    }}
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{highlightSearchTerm(product.title, searchTerm)}</p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="text-sm font-bold text-red-500">
                      {product.discountedPrice || product.originalPrice}₫
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy sản phẩm
              </div>
            )
          ) : (
            <>
              <div className="p-4">
                <p className="text-sm font-semibold mb-2">Tìm kiếm phổ biến</p>
                <div className="grid grid-cols-2 gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(search);
                        setIsFocused(true);
                      }}
                      className="text-left text-blue-500 hover:underline p-1"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold mb-2">Sản phẩm nổi bật</p>
                {isFeaturedLoading ? (
                  <div className="text-center text-gray-500 p-4">Đang tải...</div>
                ) : error ? (
                  <div className="text-center text-red-500 p-4">{error}</div>
                ) : featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {featuredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="border p-2 rounded-lg shadow hover:shadow-lg transition"
                        onClick={handleProductClick}
                      >
                        <Image
                          src={normalizeImagePath(product.image)}
                          alt={product.title}
                          width={100}
                          height={100}
                          className="object-cover rounded w-full h-24"
                          onError={(e) => {
                            e.currentTarget.src = "/images/default-product.jpg";
                          }}
                        />
                        <h3 className="text-sm font-semibold mt-1 truncate">{product.title}</h3>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                        <p className="text-xs font-bold text-red-500">
                          {product.discountedPrice || product.originalPrice}₫
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-4">
                    Không có sản phẩm Royal Canin nổi bật
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;