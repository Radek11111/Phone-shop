"use client"
import Container from '@/components/Container'
import FavouritePage from '@/components/favouritePage'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
    <section className="my-10">
      <Container>
        <Breadcrumb>
          <BreadcrumbList className="capitalize flex flex-wrap">
            <Link href={"/"} className="text-xl hover:text-primary-500">
              Home
            </Link>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl font-bold hover:text-primary-500">
              Favourite
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
          </Breadcrumb>
          <FavouritePage/>
      </Container>
    </section>
    
  </>
  )
}
