"use server";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { items, shippingAddress, billingAddress, total } = req.body;

      if (!items || items.lenght === 0) {
        return res.status(400).json({ message: "The shopping cart is empty." });
      }
      const order = await prisma.orderDetails.create({
        data: {
          status: "awaiting_shipment",
          shippingAddress: shippingAddress
            ? { create: shippingAddress }
            : undefined,
          billingAddress: billingAddress
            ? { create: billingAddress }
            : undefined,
          total,
          orderStateId: "pending",
          items: {
            create: items.map((item: any) => ({
              name: item.name,
              price: item.price,
              qty: item.qty,
              thumbnail: item.thumbnail,
            })),
          },
          isPaid: false,
        },
        include: { items: true, shippingAddress: true, billingAddress: true },
      });
      return res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  } else {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }
}
