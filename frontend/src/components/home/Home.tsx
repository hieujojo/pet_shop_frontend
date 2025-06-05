"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import FoodProducts from "./FoodProducts";
import AccessoryProducts from "./AccessoryProducts";
import Collections from "./Collections";
import BrandBoss from "./Brand";
import ArticleCard from "./ArticleCard";
import SupportChat from "@/components/chatbot/SupportChat";
import { services } from "@/data/servicesData";

const Home = () => {
  return (
    <>
      <div className="bg-[#ffd700] h-[65px]">
        <div>
          <div className="flex justify-center text-sm items-center dark:text-black">
            <div className="mt-2">Giảm đến</div>
            <div className="font-bold underline ml-1 mt-2"> 50% OFF</div>
            <div className="ml-1 mt-2">cho thành viên Paddiers*.</div>
          </div>
          <div className="flex justify-center text-white text-[13px] items-center mt-1">
            <button
              type="submit"
              className="bg-[#234BBB] font-bold w-32 text-white px-3 py-1 rounded-3xl ml-4"
            >
              Đăng ký ngay!
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="https://paddy.vn/cdn/shop/files/z4562405431549_c0a99767703385433c54c1477709b82b.jpg?v=1742465924&width=2000"
          alt="shiba"
          width={1360}
          height={1000}
        />
      </div>
      <div className="mt-10 flex justify-center">
        <div className="flex">
          {services.map((service, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 relative group">
                <Link href={service.href}>
                  <div
                    className="overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105"
                    style={{ clipPath: "inset(10px 10px 10px 10px)" }}
                  >
                    <Image
                      src={service.src}
                      width={352}
                      height={150}
                      alt={service.alt}
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
              {index < services.length - 1 && (
                <div className="border-r mx-[-5px] my-[10px] border-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="font-bold text-xl mt-1 ml-20 ">
        Mua sắm theo giống thú cưng
      </div>
      <div className="flex mt-3 ml-20">
        <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-102 origin-center will-change-transform">
          <Link href="/dog-protucts">
            <Image
              src="https://paddy.vn/cdn/shop/files/dog_banner_1370x.jpg?v=1670135189"
              alt="Dog protucts"
              width={670}
              height={500}
              className="object-cover transition-transform duration-300 transform hover:scale-110"
            />
          </Link>
        </div>

        <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-102 ml-[20px] origin-center will-change-transform">
          <Link href="/cat-protucts">
            <Image
              src="https://paddy.vn/cdn/shop/files/cat_banner_1370x.jpg?v=1670135516"
              alt="Cat protucts"
              width={670}
              height={500}
              className="object-cover transition-transform duration-300 transform hover:scale-110"
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center my-6 rounded-lg ">
      <Image
              src="https://paddy.vn/cdn/shop/files/034edd24668bd5d58c9a_1880x.jpg?v=1745468018"
              alt="Cat protucts"
              width={1200}
              height={500}
              className="object-cover transition-transform duration-300 transform hover:scale-110"
            />
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[#234BBB] font-bold text-[23px] ml-[630px] mt-6">
          Bộ Sưu Tập Cho Mèo Con
        </div>
        <div className="mt-7 text-[15px]">
          <Link
            href="/cat=protucts"
            className="text-[#234BBB] cursor-pointer underline-offset-2 underline mr-20"
          >
            Xem Tất Cả
          </Link>
        </div>
      </div>
      <div>
        <Collections />
      </div>
      <div className="flex justify-between items-center">
        <div className="font-bold text-[20px] ml-20 mt-6">
          Được boss yêu thích
        </div>
        <div className="mt-7 text-[15px]">
          <Link
            href="/cat=protucts"
            className="text-[#234BBB] cursor-pointer underline-offset-2 underline mr-20"
          >
            Xem Tất Cả
          </Link>
        </div>
      </div>
      <>
        <FoodProducts />
      </>
      <hr className="mt-20 border-t-2 border-gray-500 my-4 mx-auto w-[9%]" />
      <div className="flex justify-between items-center">
        <div className="font-bold text-[20px] ml-20 mt-6">Hàng mới về</div>
        <div className="mt-7 text-[15px]">
          <Link
            href="/cat=protucts"
            className="text-[#234BBB] cursor-pointer underline-offset-2 underline mr-20"
          >
            Xem Tất Cả
          </Link>
        </div>
      </div>
      <>
        <AccessoryProducts />
      </>
      <div className="flex justify-between items-center mt-10">
        <div className="font-bold text-2xl ml-20 mt-6">
          1000+ Thương Hiệu Boss Thích
        </div>
        <div className="mt-7 text-[15px]">
          <Link
            href="/cat=protucts"
            className="text-[#234DDD] cursor-pointer underline-offset-2 underline mr-20"
          >
            Xem Tất Cả
          </Link>
        </div>
      </div>
      <>
        <BrandBoss />
      </>
      <div className="flex justify-between items-center mt-12">
        <div className="font-bold text-2xl ml-20 mt-6">
          Chăm Boss Cùng Paddy
        </div>
        <div className="mt-7 text-[15px]">
          <Link
            href="/cat=protucts"
            className="text-[#234BBB] cursor-pointer underline-offset-2 underline mr-20"
          >
            Xem Tất Cả
          </Link>
        </div>
      </div>
      <>
        <ArticleCard />
      </>
      <>
        <SupportChat />
      </>
    </>
  );
};

export default Home;
