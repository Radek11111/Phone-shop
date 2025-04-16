"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const data = await req.json();
    const { orderId } = await params;

    console.log("PUT request received for orderId:", orderId);

    const order = await db.orderDetails.findUnique({
      where: { id: orderId },
      include: { shippingAddress: true },
    });

    if (!order) {
      console.log("Order not found for orderId:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.shippingAddress) {
      console.log("Shipping address not found for orderId:", orderId);
      return NextResponse.json(
        { error: "Shipping address not found for this order" },
        { status: 400 }
      );
    }

    const updatedAddress = await db.shippingAddress.update({
      where: { id: order.shippingAddress.id },
      data: {
        name: data.name,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phoneNumber: data.phoneNumber || "",
        state: data.state || "",
      },
    });

    return NextResponse.json(
      { success: true, shippingAddress: updatedAddress },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating shipping details:", error);
    return NextResponse.json(
      { error: "Failed to update shipping details" },
      { status: 500 }
    );
  }
}
