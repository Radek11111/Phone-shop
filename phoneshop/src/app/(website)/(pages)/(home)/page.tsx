import HomeSlide from "@/components/Home/HomeSlide";
import Payments from "@/components/Home/Payments";
import {Reviews} from "@/components/Home/Reviews";
import React from "react";

export default function Home() {
  return (
    <div>
      <HomeSlide />
      <Payments />
      <Reviews />
    </div>
  );
}
