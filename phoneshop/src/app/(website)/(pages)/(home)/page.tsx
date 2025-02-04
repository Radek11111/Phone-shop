import HomeSlide from "./HomeSlide";
import Payments from "./Payments";
import {Reviews} from "./Reviews";
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
