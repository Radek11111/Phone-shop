"use client";
import React, { useState, useEffect } from "react";
import Container from "../../../../components/Container";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";


export default function HomeSlide() {
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = ["/man-1868730_1280.jpg", "/mobile-phone-791644_1280.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section>
      <Container>
        {loading ? (
          <Skeleton className="h-[700px] w-full" />
        ) : (
          <Swiper
            autoplay={false}
            spaceBetween={50}
            slidesPerView={1}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation, Pagination]}
            className={cn("")}
          >
            <SwiperSlide
              className="relative flex items-center justify-center"
              style={{
                backgroundImage: `url(${images[currentImage]})`,
                height: "700px",
                width: "100%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 1s ease-in-out",
              }}
            ></SwiperSlide>
          </Swiper>
        )}
      </Container>
    </section>
  );
}
