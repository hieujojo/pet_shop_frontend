import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: string;
  brand: string;
  image: string | null; // Cho phép null
  href: string | null; // Cho phép null
}

const BrandBoss = () => {
  const [brands, setBrands] = useState<Brand[]>([]); 

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/brands');
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        const data: Brand[] = await response.json();
        
        // Xử lý dữ liệu trước khi set state
        const processedData = data.map(brand => ({
          ...brand,
          href: brand.href || `/brands/${brand.id}`, // Fallback cho href
          image: brand.image || '/images/default-brand.png', // Fallback cho ảnh
          brand: brand.brand || 'Thương hiệu' // Fallback cho tên
        }));
        
        setBrands(processedData);
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Set giá trị mặc định nếu fetch thất bại
        setBrands([
          {
            id: 'default',
            brand: 'Thương hiệu mặc định',
            image: '/images/default-brand.png',
            href: '/brands'
          }
        ]);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="grid grid-rows-2 grid-cols-8 gap-4 mt-12 mx-20">
      {brands.map((product) => {
        // Đảm bảo href không bao giờ null
        const safeHref = product.href || `/brands/${product.id}`;
        // Đảm bảo alt text không rỗng
        const altText = product.brand || `Thương hiệu ${product.id}`;
        
        return (
          <div
            key={product.id}
            className="relative flex flex-col items-center justify-center"
          >
            <Link href={safeHref} className="w-full" passHref legacyBehavior>
              <a>
                <div className="relative shadow-lg overflow-hidden h-[160px] flex flex-col items-center justify-center rounded-lg box-shadow hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-[160px] h-[100px]">
                    <Image
                      src={product.image || '/images/default-brand.png'}
                      alt={altText}
                      width={160}
                      height={100}
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-brand.png';
                      }}
                    />
                  </div>
                  <h3 className="mt-2 text-center hover:text-[#234BBB] hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-300">
                    {product.brand}
                  </h3>
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BrandBoss;