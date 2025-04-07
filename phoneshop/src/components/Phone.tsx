import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

const PHONES = [
  "/Smartfon-APPLE1.jpg",
  "/Smartfon-APPLE2.jpg",
  "/Smartfon-APPLE3.jpg",
  "/Smartfon-SAMSUNG1.jpg",
  "/Smartfon-SAMSUNG2.jpg",
  "/Smartfon-SAMSUNG3.jpg",
];

const Phone = ({ imgSrc, className, dark = false, ...props }: PhoneProps) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <Image
        src={imgSrc}
        className="pointer-events-none z-50 select-none"
        alt="phone image"
        width={1000}
        height={1000}
      />

      <div className="absolute -z-10 inset-0">
        <Image
          className="object-cover min-w-full min-h-full"
          src={imgSrc}
          alt="overlaying phone image"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};

export default Phone;
