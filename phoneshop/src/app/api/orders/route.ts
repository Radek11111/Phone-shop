"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const { items, total, shipping } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    if (!shipping) {
      return NextResponse.json(
        { error: "Shipping details are required" },
        { status: 400 }
      );
    }

    const order = await db.orderDetails.create({
      data: {
        total,
        status: "awaiting_payment",
        items: {
          create: items.map((item: any) => ({
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail || "",
            qty: item.qty,
          })),
        },
        shippingAddress: {
          create: {
            name: shipping.name,
            street: shipping.street,
            city: shipping.city,
            postalCode: shipping.postalCode,
            country: shipping.country,
            state: shipping.state || "",
            phoneNumber: shipping.phoneNumber || "",
          },
        },
      },
      include: {
        shippingAddress: true,
      },
    });

    console.log("Zapisano zamówienie w bazie z ID:", order.id);
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
