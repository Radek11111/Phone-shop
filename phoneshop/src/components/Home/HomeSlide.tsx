"use client";
import React, { useState, useEffect } from "react";
import Container from "../Container";
import { Skeleton } from "../ui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";


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
            >
             
              <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

             
              <div className="relative z-20 flex items-center justify-center left-40">
                <Button
                  variant="default"
                  size="lg"
                  className="hover:shadow-button px-12 py-8 bg-white bg-opacity-40 text-black hover:bg-opacity-90 hover:text-white"
                >
                  <Link href="" className="text-xl">
                    BUY NOW
                  </Link>
                </Button>
              </div>
            </SwiperSlide>
          </Swiper>
        )}
      </Container>
    </section>
  );
}
