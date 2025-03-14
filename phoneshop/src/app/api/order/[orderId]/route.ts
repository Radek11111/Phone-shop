"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
      const { orderId } = params;
  
      const order = await db.orderDetails.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          shippingAddress: true,
        },
      });
  
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
  
      return NextResponse.json({
        id: order.id,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          thumbnail: item.thumbnail,
        })),
        total: order.total,
        shipping: order.shippingAddress
          ? {
              name: order.shippingAddress.name,
              street: order.shippingAddress.street,
              city: order.shippingAddress.city,
              postalCode: order.shippingAddress.postalCode,
              country: order.shippingAddress.country,
              state: order.shippingAddress.state,
              phoneNumber: order.shippingAddress.phoneNumber,
            }
          : null,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        isPaid: order.isPaid,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }