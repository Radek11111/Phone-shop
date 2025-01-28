import CartPage from "@/components/CartPage";
import Container from "@/components/Container";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export default function page() {
    return (
        <>
        <section className="my-10">
          <Container>
            <Breadcrumb>
              <BreadcrumbList className="capitalize flex flex-wrap">
                <Link href={"/store"} className="text-xl hover:text-primary-500">
                  Store
                </Link>
    
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xl font-bold hover:text-primary-500">
                  Cart
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
              </Breadcrumb>
              <CartPage/>
          </Container>
        </section>
        
      </>
  );
}
