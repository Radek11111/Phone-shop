import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function logo({ className }: { className?: string }) {
  return (
    <Link href="/">
      <Image
        className={cn("w-48 h-28", className)}
        src="/Logo.svg"
        alt="logo"
        width="0"
        height="0"
        priority
      />
    </Link>
  );
}
