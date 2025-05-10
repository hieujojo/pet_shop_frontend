import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Shuffle, Search } from "lucide-react";

interface Product {
  id: string;
  title: string;
  brand: string;
  originalPrice: string;
  discountedPrice?: string;
  quantity: string;
  image: string;
  hoverImage: string;
  href: string;
  category: string;
}

const AccessoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        // Lọc sản phẩm chỉ thuộc category ps1 hoặc ps2
        const filteredProducts = data.filter(product => 
          product.category === 'PS1' || product.category === 'PS2'
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10 px-20 text-center lg:text-left">
        {currentProducts.map((product, index) => (
          <div
            key={product.id}
            className={`group overflow-hidden relative rotate-on-hover ${
              index < 4 ? "lg:mb-10" : ""
            }`}
          >
            <div className="absolute left-0 top-2 bg-[#D2E7FF] text-[#0A6CDC] px-2 py-1 text-xs inline-block z-10">
              Mới
            </div>
            <div className="flex mt-2">
              {Number(product.quantity) === 0 ? (
                <div className="absolute left-0 top-9 bg-[#F5F5F5] text-[#505050] px-2 py-1 text-xs font-bold inline-block z-10">
                  Đã bán hết
                </div>
              ) : product.discountedPrice && ["1", "2", "7"].includes(product.id) ? (
                <div className="absolute left-0 top-9 bg-[#ffd8d7] text-[#e10600] px-2 py-1 text-xs font-bold inline-block z-10">
                  Giảm giá
                </div>
              ) : null}
            </div>
            <Link href={product.href}>
              <div className="relative w-[320px] h-[320px] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image
                  src={product.hoverImage}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-opacity-40 hidden group-hover:flex flex-col justify-center items-center gap-3 transition-all duration-300">
                  <div className="absolute right-4 top-4 flex flex-col gap-3">
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-transparent flex items-center transition-all duration-300">
                      <Eye size={20} />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-transparent">
                      <Shuffle size={20} />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-transparent">
                      <Search size={20} />
                    </button>
                  </div>
                  <button className="bg-white text-black px-4 py-2 rounded-2xl w-[300px] border-2 border-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 absolute bottom-4">
                    Thêm Vào Giỏ Hàng
                  </button>
                </div>
              </div>
            </Link>
            <p className="text-[#234BBB] font-bold mt-3">{product.brand}</p>
            <h3 className="mt-2 hover:text-[#234BBB] hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-300">
              {product.title}
            </h3>
            <div className="flex mt-2">
              {product.discountedPrice && !["4", "8"].includes(product.id) ? (
                <>
                  <p className="line-through font-bold">{product.originalPrice}</p>
                  <p className="ml-2">|</p>
                  <p className="ml-3 text-red-500 font-bold">{product.discountedPrice}</p>
                </>
              ) : (
                <p className="font-bold">{product.originalPrice}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`w-3 h-3 rounded-full ${
              currentPage === i + 1 ? "bg-black" : "bg-white border border-gray-400"
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default AccessoryProducts;