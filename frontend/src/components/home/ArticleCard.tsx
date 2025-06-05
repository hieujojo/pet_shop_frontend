import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Article {
  _id: string; // _id từ MongoDB
  image?: string;
  title: string;
  name: string;
  description: string;
  category: string;
}

const ArticleCard = ({ article }: { article: Article }) => {
  // Tạo href động dựa trên _id
  const href = `/articles/${article._id || 'fallback'}`;
  // Xử lý image và alt
  const imageSrc = article.image || '/placeholder-image.jpg';
  const imageAlt = `Image for ${article.title}`;

  return (
    <div className="bg-white">
      <div className="mb-0">
        <Link
          href={href}
          className="block relative"
          style={{ paddingTop: "55%" }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            className="absolute top-0 left-0 w-full h-full"
            width={720}
            height={400}
            objectFit="cover"
          />
        </Link>
      </div>

      <div className="p-4 text-left border-x border-b h-60 border-gray-300">
        <h3 className="text-xl font-semibold mb-2 dark:text-black">
          <Link href={href}>{article.title}</Link>
        </h3>
        <div className="mb-4 text-sm text-gray-600">{article.name}</div>
        <div className="mb-4 text-gray-700">{article.description}</div>
        <Link
          href={href}
          className="text-blue-500 hover:text-blue-700"
          tabIndex={0}
        >
          Đọc thêm
        </Link>
      </div>
    </div>
  );
};

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [startIndex, setStartIndex] = useState(0); // Theo dõi chỉ số bắt đầu

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data: Article[] = await response.json();
        // Lọc chỉ các bài viết có category: blog
        const filteredArticles = data.filter(
          (article) => article.category === 'blog'
        );
        console.log('Filtered articles:', filteredArticles); // Log để kiểm tra
        setArticles(filteredArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // Xử lý nút trái
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 3);
    }
  };

  // Xử lý nút phải
  const handleNext = () => {
    if (startIndex + 3 < articles.length) {
      setStartIndex(startIndex + 3);
    }
  };

  // Lấy 3 bài viết để hiển thị
  const displayedArticles = articles.slice(startIndex, startIndex + 3);

  return (
    <div className="my-12 mx-20 relative">
      {/* Nút trái */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`absolute left-[-40px] top-1/2 transform -translate-y-1/2 p-2 rounded-full border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 hover:border-blue-600 transition ${
          startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      {/* Danh sách bài viết */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedArticles.map((article, index) => (
          <ArticleCard
            key={article._id || index} // _id là duy nhất
            article={article}
          />
        ))}
      </div>

      {/* Nút phải */}
      <button
        onClick={handleNext}
        disabled={startIndex + 3 >= articles.length}
        className={`absolute right-[-40px] top-1/2 transform -translate-y-1/2 p-2 rounded-full border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 hover:border-blue-600 transition ${
          startIndex + 3 >= articles.length ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ArticleList;