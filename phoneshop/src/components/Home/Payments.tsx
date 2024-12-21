"use client";

import {
  Calendar,
  CreditCard,
  Headset,
  LockKeyhole,
  Truck,
} from "lucide-react";
import React from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Container from "../Container";

export default function Payments() {
  return (
    <section className="py-10 w-full">
    <Container>
      <div className="w-full overflow-x-auto">
        <Swiper
          breakpoints={{
            340: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          slidesPerView="auto"
          navigation={false}
          pagination={true}
          modules={[Autoplay, Navigation, Pagination]}
          className="flex w-full overflow-x-auto"
        >
          {[
            {
              Icon: Headset,
              title: "24/7 support",
              description: "Support every time",
            },
            {
              Icon: CreditCard,
              title: "Accept payment",
              description: "Visa, PayPal, Master",
            },
            {
              Icon: LockKeyhole,
              title: "Secured payment",
              description: "100% secured",
            },
            {
              Icon: Calendar,
              title: "30 days return",
              description: "30 days guarantee",
            },
            {
              Icon: Truck,
              title: "Free shipping",
              description: "Order over $300",
            },
          ].map((item, index) => (
            <SwiperSlide
              key={index}
              style={{ flex: "0 0 auto", width: "200px" }}
              className="min-w-[200px] flex-shrink-0 relative py-10 flex items-center justify-center"
            >
              <div className="flex items-center gap-4 lg:after:h-10 lg:after:w-[2px] after:translate-x-14 after:bg-neutral-200">
                <item.Icon className="text-primary-900 h-6 w-6" />
                <div className="flex-col gap-4">
                  <h6 className="uppercase font-bold text-slate-700">
                    {item.title}
                  </h6>
                  <span className="text-sm text-slate-700 font-normal">
                    {item.description}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  </section>
  
  
  );
}
