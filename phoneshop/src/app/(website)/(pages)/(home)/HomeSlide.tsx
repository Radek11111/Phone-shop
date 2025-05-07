"use client";
import React, { useState, useEffect } from "react";
import Container from "../../../../components/Container";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomeSlide: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const images: string[] = [
    "/man-1868730_1280.jpg",
    "/mobile-phone-791644_1280.jpg",
  ];

  const mobileBackgroundPositions: { [key: string]: string } = {
    "/man-1868730_1280.jpg": "left 20% center",
    "/mobile-phone-791644_1280.jpg": "center center",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      <Container>
        {loading ? (
          <Skeleton className="h-[700px] w-full" />
        ) : (
          <Swiper
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            spaceBetween={200}
            slidesPerView={1}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={index}
                className="relative flex items-center justify-center"
                style={{
                  backgroundImage: `url(${image})`,
                  height: "700px",
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: isMobile
                    ? mobileBackgroundPositions[image] || "center"
                    : "center",
                  transition: "opacity 0.5s ease-in-out",
                }}
              ></SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
};

export default HomeSlide;
