import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const { items, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const order = await db.orderDetails.create({
      data: {
        total,
        orderStateId: "initial", 
        status: "awaiting_payment",
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            thumbnail: item.thumbnail,
            qty: item.qty,
            title: item.name,
          })),
        },
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 }); 
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}