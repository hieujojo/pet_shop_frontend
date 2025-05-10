import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Collection {
  id: string;
  title: string;
  href: string | null; // Cho phép null nhưng sẽ xử lý
  imageSrc: string;
}

const Collections = () => {
  const [items, setItems] = useState<Collection[]>([]); 

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/collections');
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }
        const data: Collection[] = await response.json();
        
        // Xử lý dữ liệu trước khi set state
        const processedData = data.map(item => ({
          ...item,
          href: item.href || `/collections/${item.id}`, // Fallback nếu href null
          imageSrc: item.imageSrc || '/images/default-collection.jpg' // Fallback cho ảnh
        }));
        
        setItems(processedData);
      } catch (error) {
        console.error('Error fetching collections:', error);
        // Set giá trị mặc định nếu fetch thất bại
        setItems([
          {
            id: '1',
            title: 'Bộ sưu tập mặc định',
            href: '/collections/default',
            imageSrc: '/images/default-collection.jpg'
          }
        ]);
      }
    };

    fetchCollections();
  }, []); 

  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {items.map((item) => {
        // Đảm bảo href không bao giờ null
        const safeHref = item.href || `/collections/${item.id}`;
        
        return (
          <div
            key={item.id}
            className="flex flex-col items-center w-[200px] text-center"
          >
            <div className="w-full max-w-[1000px] mx-auto">
              <Link href={safeHref} className="block relative pt-[10%]">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={165}
                  height={165}
                  layout="responsive"
                  className="rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-collection.jpg';
                  }}
                />
              </Link>
            </div>
            <Link
              href={safeHref}
              className="text-center mt-2 text-black text-lg font-medium hover:text-[#234bbb] hover:underline hover:underline-offset-2"
            >
              {item.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Collections;